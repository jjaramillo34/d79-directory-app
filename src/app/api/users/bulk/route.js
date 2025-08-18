const { NextResponse } = require('next/server');
const connectDB = require('../../../../lib/mongodb');
const User = require('../../../../models/User');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../../../lib/auth');

async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.level < 4) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { userIds, action } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid user IDs' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    let result;
    let message;

    switch (action) {
      case 'activate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: true } }
        );
        message = `Activated ${result.modifiedCount} users`;
        break;

      case 'deactivate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: false } }
        );
        message = `Deactivated ${result.modifiedCount} users`;
        break;

      case 'delete':
        result = await User.deleteMany({ _id: { $in: userIds } });
        message = `Deleted ${result.deletedCount} users`;
        break;

      case 'level_up':
        result = await User.updateMany(
          { _id: { $in: userIds }, level: { $lt: 4 } },
          { $inc: { level: 1 } }
        );
        message = `Promoted ${result.modifiedCount} users`;
        break;

      case 'level_down':
        result = await User.updateMany(
          { _id: { $in: userIds }, level: { $gt: 1 } },
          { $inc: { level: -1 } }
        );
        message = `Demoted ${result.modifiedCount} users`;
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message,
      result 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Bulk user action error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

module.exports = { POST };
