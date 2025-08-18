const { NextResponse } = require('next/server');
const connectDB = require('../../../../../lib/mongodb');
const User = require('../../../../../models/User');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../../../../lib/auth');

async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.level < 4) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    const { permissions } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!permissions || typeof permissions !== 'object') {
      return new Response(JSON.stringify({ error: 'Permissions object is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await connectDB();

    // Update user with new permissions
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: permissions },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User permissions updated successfully',
      user: updatedUser
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Update user permissions error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

module.exports = { PUT };
