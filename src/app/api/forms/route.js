const { NextResponse } = require('next/server');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../../lib/auth');
const connectDB = require('../../../lib/mongodb');
const FormSubmission = require('../../../models/FormSubmission');
const User = require('../../../models/User');

// GET /api/forms - Get user's forms or all forms (for admins)
async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let forms;
    
    if (user.level === 5) {
      // Super Admin can see all forms
      forms = await FormSubmission.find({})
        .populate('userId', 'name email level')
        .sort({ updatedAt: -1 });
    } else if (user.level === 4) {
      // Admin Principal can see forms from their school and forms they've assigned
      const schoolForms = await FormSubmission.find({ schoolName: user.schoolName })
        .populate('userId', 'name email level')
        .sort({ updatedAt: -1 });
      
      // Also include forms they've assigned to others
      const assignedForms = await FormSubmission.find({
        _id: { $in: user.assignedForms.map(assignment => assignment.formId) }
      }).populate('userId', 'name email level');
      
      // Combine and deduplicate
      const allForms = [...schoolForms, ...assignedForms];
      const uniqueForms = allForms.filter((form, index, self) => 
        index === self.findIndex(f => f._id.toString() === form._id.toString())
      );
      
      forms = uniqueForms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else {
      // Regular users can see their own forms AND forms shared with them
      const ownForms = await FormSubmission.find({ userId: user._id });
      
      // Get forms shared with this user
      const sharedForms = await FormSubmission.find({
        _id: { $in: user.assignedForms.map(assignment => assignment.formId) }
      });
      
      // Combine and deduplicate forms
      const allForms = [...ownForms, ...sharedForms];
      const uniqueForms = allForms.filter((form, index, self) => 
        index === self.findIndex(f => f._id.toString() === form._id.toString())
      );
      
      forms = uniqueForms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      // Populate user data for all forms
      forms = await FormSubmission.populate(forms, { path: 'userId', select: 'name email level' });
      
      // Add collaboration info to each form
      forms = forms.map(form => {
        const formObj = form.toObject();
        const assignment = user.assignedForms.find(a => a.formId.toString() === form._id.toString());
        
        return {
          ...formObj,
          isShared: !!assignment,
          collaborationPermissions: assignment ? assignment.permissions : null,
          assignedSections: assignment ? assignment.assignedSections : [],
          assignedAt: assignment ? assignment.assignedAt : null
        };
      });
    }

    return NextResponse.json({ forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/forms - Create new form
async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has permission to create forms (Level 4+)
    if (user.level < 4) {
      return NextResponse.json({ error: 'Insufficient permissions. Only Admin Principals (Level 4) and Super Admins (Level 5) can create forms.' }, { status: 403 });
    }

    const { schoolName, initialOwnerEmail } = await request.json();

    if (!schoolName || !schoolName.trim()) {
      return NextResponse.json({ error: 'School name is required' }, { status: 400 });
    }

    let formOwner = user;
    let principalEmail = user.email;
    let principalName = user.name;

    // If super admin is creating a form for someone else
    if (user.level === 5 && initialOwnerEmail && initialOwnerEmail !== user.email) {
      const initialOwner = await User.findOne({ email: initialOwnerEmail });
      if (!initialOwner) {
        return NextResponse.json({ error: 'Initial owner not found' }, { status: 404 });
      }
      
      // Verify the initial owner is a Level 4 (Admin Principal)
      if (initialOwner.level !== 4) {
        return NextResponse.json({ 
          error: 'Initial owner must be a Level 4 (Admin Principal) user' 
        }, { status: 400 });
      }

      formOwner = initialOwner;
      principalEmail = initialOwner.email;
      principalName = initialOwner.name;
    }

    // Create new form submission
    const newForm = new FormSubmission({
      userId: formOwner._id,
      schoolName: schoolName.trim(),
      principalEmail: principalEmail,
      principalName: principalName,
      status: 'draft',
      currentStep: 1,
      createdBy: user._id, // Track who actually created it
    });

    // If this is a super admin creating for someone else, add transfer history
    if (user.level === 5 && initialOwnerEmail && initialOwnerEmail !== user.email) {
      newForm.transferHistory = [{
        from: user._id,
        to: formOwner._id,
        transferredBy: user._id,
        transferredAt: new Date(),
        reason: 'Initial creation by Super Admin'
      }];
    }

    await newForm.save();

    return NextResponse.json({ 
      success: true, 
      formId: newForm._id.toString(),
      message: 'Form created successfully' 
    });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { GET, POST };