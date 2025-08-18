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
    
    if (user.level === 4) {
      // Admin can see all forms
      forms = await FormSubmission.find({})
        .populate('userId', 'name email level')
        .sort({ updatedAt: -1 });
    } else {
      // Regular users can only see their own forms
      forms = await FormSubmission.find({ userId: user._id })
        .sort({ updatedAt: -1 });
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

    // Check if user has permission to create forms (Level 3+)
    if (user.level < 3) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { schoolName } = await request.json();

    if (!schoolName || !schoolName.trim()) {
      return NextResponse.json({ error: 'School name is required' }, { status: 400 });
    }

    // Create new form submission
    const newForm = new FormSubmission({
      userId: user._id,
      schoolName: schoolName.trim(),
      principalEmail: user.email,
      principalName: user.name,
      status: 'draft',
      currentStep: 1,
    });

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