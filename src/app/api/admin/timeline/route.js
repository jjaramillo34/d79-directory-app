const { NextResponse } = require('next/server');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../../../lib/auth');
const connectDB = require('../../../../lib/mongodb');
const FormSubmission = require('../../../../models/FormSubmission');

async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.level !== 4) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Check if FormSubmission model is available
    if (!FormSubmission) {
      console.error('FormSubmission model not found');
      return NextResponse.json({ error: 'FormSubmission model not available' }, { status: 500 });
    }

    // Test basic collection access
    try {
      const count = await FormSubmission.countDocuments();
    } catch (countError) {
      console.error('Error counting documents:', countError);
      return NextResponse.json({ error: 'Cannot access FormSubmission collection' }, { status: 500 });
    }

    // Get current date and calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const twentyDaysAgo = new Date(now.getTime() - (20 * 24 * 60 * 60 * 1000));
    const tenDaysAgo = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Simple approach: get all submissions and filter in memory
    let allSubmissions;
    try {
      allSubmissions = await FormSubmission.find({}).lean();
    } catch (findError) {
      console.error('Error finding submissions:', findError);
      return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
    }

    // Calculate timeline data manually
    const timelineData = {
      '30_days_ago': { submitted: 0, approved: 0, underReview: 0 },
      '20_days_ago': { submitted: 0, approved: 0, underReview: 0 },
      '10_days_ago': { submitted: 0, approved: 0, underReview: 0 },
      'today': { submitted: 0, approved: 0, underReview: 0 }
    };

    // Calculate weekly data
    let weeklySubmitted = 0;
    let weeklyApproved = 0;

    // Calculate total counts
    let totalSubmitted = 0;
    let totalApproved = 0;
    let totalUnderReview = 0;

    allSubmissions.forEach(submission => {
      const createdAt = new Date(submission.createdAt);
      const status = submission.status;

      // Count by status
      if (status === 'submitted') totalSubmitted++;
      if (status === 'approved') totalApproved++;
      if (status === 'under_review') totalUnderReview++;

      // Weekly data
      if (createdAt >= sevenDaysAgo) {
        if (status === 'submitted') weeklySubmitted++;
        if (status === 'approved') weeklyApproved++;
      }

      // Timeline data
      if (createdAt >= thirtyDaysAgo) {
        if (createdAt >= twentyDaysAgo) {
          if (createdAt >= tenDaysAgo) {
            // Recent (10-20 days ago)
            if (status === 'submitted') timelineData['10_days_ago'].submitted++;
            if (status === 'approved') timelineData['10_days_ago'].approved++;
            if (status === 'under_review') timelineData['10_days_ago'].underReview++;
          } else {
            // 20-30 days ago
            if (status === 'submitted') timelineData['20_days_ago'].submitted++;
            if (status === 'approved') timelineData['20_days_ago'].approved++;
            if (status === 'under_review') timelineData['20_days_ago'].underReview++;
          }
        } else {
          // 30+ days ago
          if (status === 'submitted') timelineData['30_days_ago'].submitted++;
          if (status === 'approved') timelineData['30_days_ago'].approved++;
          if (status === 'under_review') timelineData['30_days_ago'].underReview++;
        }
      }
    });

    // Format the response
    const formattedData = {
      timeline: timelineData,
      weekly: {
        submitted: weeklySubmitted,
        approved: weeklyApproved
      },
      totals: {
        submitted: totalSubmitted,
        approved: totalApproved,
        underReview: totalUnderReview,
        total: allSubmissions.length
      }
    };

    return NextResponse.json({ data: formattedData });

  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

module.exports = { GET };
