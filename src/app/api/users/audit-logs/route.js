const { NextResponse } = require('next/server');
const connectDB = require('../../../../lib/mongodb');
const { getServerSession } = require('next-auth/next');
const { authOptions } = require('../../../../lib/auth');

async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.level < 4) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For now, return mock audit logs since we haven't implemented the audit system yet
    const mockAuditLogs = [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        userName: 'Javier Jaramillo',
        action: 'User Created',
        details: 'Created new user: Randy Cole',
        ipAddress: '192.168.1.100'
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        userName: 'Javier Jaramillo',
        action: 'User Updated',
        details: 'Updated user level: Sarada Dorce -> Level 3',
        ipAddress: '192.168.1.100'
      }
    ];

    return new Response(JSON.stringify({ 
      success: true,
      logs: mockAuditLogs,
      message: 'Mock audit logs loaded (real audit system coming soon)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fetch audit logs error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

module.exports = { GET };
