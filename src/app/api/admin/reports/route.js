const { NextResponse } = require('next/server');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../../../lib/auth');
const connectDB = require('../../../../lib/mongodb');
const FormSubmission = require('../../../../models/FormSubmission');
const User = require('../../../../models/User');

// POST /api/admin/reports - Generate CSV report
async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.level !== 4) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { startDate, endDate, status } = await request.json();

    // Build query
    const query = {};
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch submissions
    const submissions = await FormSubmission.find(query)
      .populate('userId', 'name email level')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    // Generate CSV content
    const csvHeaders = [
      'School Name',
      'Principal Name',
      'Principal Email',
      'Status',
      'Current Step',
      'Completed Steps',
      'Progress %',
      'Submitted Date',
      'Reviewed By',
      'Review Date',
      'Review Comments',
      'Created Date',
      'Last Updated'
    ];

    const csvRows = submissions.map(submission => {
      const completedSteps = submission.completedSteps || [];
      const progress = Math.round((completedSteps.length / 15) * 100);
      
      return [
        submission.schoolName || '',
        submission.principalName || '',
        submission.principalEmail || '',
        submission.status || '',
        submission.currentStep || '',
        completedSteps.join(', '),
        `${progress}%`,
        submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : '',
        submission.reviewedBy?.name || '',
        submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleDateString() : '',
        submission.reviewComments || '',
        submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : '',
        submission.updatedAt ? new Date(submission.updatedAt).toLocaleDateString() : ''
      ].map(field => `"${field}"`).join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="submissions-report-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { POST };
