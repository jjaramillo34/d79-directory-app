import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import FormSubmission from '@/models/FormSubmission';

// POST: Share a form with users for collaboration
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only principals (level 4) can share forms
    if (session.user.level < 4) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { formId, userIds, permissions = 'edit', sections = [] } = body;

    // Validate required fields
    if (!formId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Form ID and user IDs are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the form exists and belongs to the principal's school
    const form = await FormSubmission.findById(formId);
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    if (form.schoolName !== session.user.schoolName) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Get all users to be assigned
    const users = await User.find({
      _id: { $in: userIds },
      schoolName: session.user.schoolName,
      isActive: true
    });

    if (users.length !== userIds.length) {
      return NextResponse.json(
        { error: 'Some users not found or not in your school' },
        { status: 400 }
      );
    }

    // Assign forms to users
    const assignmentResults = [];
    
    for (const user of users) {
      try {
        await user.assignForm(formId, session.user.id, permissions, sections);
        
        // Log the activity
        await user.logActivity(
          'form_assigned', 
          formId, 
          `Form shared by ${session.user.name} with ${permissions} permissions`
        );

        assignmentResults.push({
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          success: true
        });
      } catch (error) {
        console.error(`Error assigning form to user ${user.email}:`, error);
        assignmentResults.push({
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          success: false,
          error: error.message
        });
      }
    }

    // Log the principal's activity
    const principal = await User.findById(session.user.id);
    if (principal) {
      await principal.logActivity(
        'form_shared',
        formId,
        `Shared form with ${userIds.length} users`
      );
    }

    return NextResponse.json({
      success: true,
      message: `Form shared with ${userIds.length} users`,
      assignments: assignmentResults
    });

  } catch (error) {
    console.error('Error sharing form:', error);
    return NextResponse.json(
      { error: 'Failed to share form' },
      { status: 500 }
    );
  }
}

// GET: Get collaboration details for a form
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get the form
    const form = await FormSubmission.findById(formId);
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Check if user has access to this form
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Principals can see all collaborations, users can only see their own
    let collaborationQuery = {};
    
    if (session.user.level < 4) {
      // Regular user - only show their own assignments
      collaborationQuery = { _id: session.user.id };
    } else {
      // Principal - show all users assigned to this form
      collaborationQuery = { 'assignedForms.formId': formId };
    }

    const collaboratingUsers = await User.find(collaborationQuery)
      .select('name email title assignedForms')
      .populate('assignedForms.assignedBy', 'name email');

    // Format collaboration data
    const collaborations = collaboratingUsers.map(user => {
      const formAssignment = user.assignedForms.find(
        assignment => assignment.formId.toString() === formId
      );
      
      return {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        title: user.title,
        permissions: formAssignment?.permissions || 'none',
        assignedSections: formAssignment?.assignedSections || [],
        assignedAt: formAssignment?.assignedAt,
        assignedBy: formAssignment?.assignedBy ? {
          name: formAssignment.assignedBy.name,
          email: formAssignment.assignedBy.email
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      form: {
        id: form._id.toString(),
        schoolName: form.schoolName,
        status: form.status
      },
      collaborations
    });

  } catch (error) {
    console.error('Error fetching form collaborations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaborations' },
      { status: 500 }
    );
  }
}
