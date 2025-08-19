import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import FormSubmission from '@/models/FormSubmission';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Super Admins (Level 5) can transfer form ownership
    if (session.user.level !== 5) {
      return NextResponse.json({ 
        error: 'Only Super Admins can transfer form ownership' 
      }, { status: 403 });
    }

    const { formId, newOwnerEmail } = await request.json();

    if (!formId || !newOwnerEmail) {
      return NextResponse.json({ 
        error: 'Form ID and new owner email are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Find the form
    const form = await FormSubmission.findById(formId);
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Find the new owner
    const newOwner = await User.findOne({ email: newOwnerEmail });
    if (!newOwner) {
      return NextResponse.json({ 
        error: 'New owner not found' 
      }, { status: 404 });
    }

    // Verify the new owner is a Level 4 (Admin Principal)
    if (newOwner.level !== 4) {
      return NextResponse.json({ 
        error: 'New owner must be a Level 4 (Admin Principal) user' 
      }, { status: 400 });
    }

    // Update the form ownership
    const oldOwnerId = form.userId;
    form.userId = newOwner._id;
    form.schoolName = newOwner.schoolName;
    form.principalName = newOwner.name;
    form.principalEmail = newOwner.email;
    
    // Add transfer history
    if (!form.transferHistory) {
      form.transferHistory = [];
    }
    form.transferHistory.push({
      from: oldOwnerId,
      to: newOwner._id,
      transferredBy: session.user._id,
      transferredAt: new Date(),
      reason: 'Super Admin transfer'
    });

    await form.save();

    // Log activity for both users
    if (oldOwnerId) {
      const oldOwner = await User.findById(oldOwnerId);
      if (oldOwner) {
        oldOwner.logActivity('form_ownership_transferred', 'form', {
          formId: form._id,
          transferredTo: newOwner.email,
          transferredBy: session.user.email
        });
        await oldOwner.save();
      }
    }

    newOwner.logActivity('form_ownership_received', 'form', {
      formId: form._id,
      transferredFrom: oldOwnerId ? 'Super Admin' : 'System',
      transferredBy: session.user.email
    });
    await newOwner.save();

    return NextResponse.json({ 
      success: true, 
      message: `Form ownership transferred to ${newOwner.name}`,
      form: {
        id: form._id,
        schoolName: form.schoolName,
        principalName: form.principalName,
        principalEmail: form.principalEmail
      }
    });

  } catch (error) {
    console.error('Error transferring form ownership:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Super Admins can view transfer history
    if (session.user.level !== 5) {
      return NextResponse.json({ 
        error: 'Access denied' 
      }, { status: 403 });
    }

    await connectDB();

    // Get all forms with transfer history
    const forms = await FormSubmission.find({ 
      'transferHistory.0': { $exists: true } 
    })
    .populate('userId', 'name email level schoolName')
    .populate('transferHistory.from', 'name email')
    .populate('transferHistory.to', 'name email')
    .populate('transferHistory.transferredBy', 'name email')
    .sort({ 'transferHistory.transferredAt': -1 });

    return NextResponse.json({ forms });

  } catch (error) {
    console.error('Error fetching transfer history:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
