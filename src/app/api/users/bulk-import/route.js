import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Super Admins (Level 5) can bulk import users
    if (session.user.level !== 5) {
      return NextResponse.json({ 
        error: 'Only Super Admins can bulk import users' 
      }, { status: 403 });
    }

    const { users } = await request.json();

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid users data. Expected a non-empty array.' 
      }, { status: 400 });
    }

    // Validate CSV structure
    const requiredFields = ['name', 'email', 'level', 'schoolName'];
    const validationErrors = [];
    
    users.forEach((user, index) => {
      const row = index + 2; // +2 because index 0 = row 1, and we skip header row
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!user[field] || user[field].trim() === '') {
          validationErrors.push({
            row,
            message: `Missing required field: ${field}`
          });
        }
      });

      // Validate email format
      if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        validationErrors.push({
          row,
          message: `Invalid email format: ${user.email}`
        });
      }

      // Validate level (should be 1-5)
      if (user.level && (!Number.isInteger(Number(user.level)) || user.level < 1 || user.level > 5)) {
        validationErrors.push({
          row,
          message: `Invalid level: ${user.level}. Must be 1-5.`
        });
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'CSV validation failed',
        errors: validationErrors
      }, { status: 400 });
    }

    await connectDB();

    const results = {
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    // Process users in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      for (const userData of batch) {
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email: userData.email });
          if (existingUser) {
            results.errorCount++;
            results.errors.push({
              row: i + batch.indexOf(userData) + 2,
              message: `User with email ${userData.email} already exists`
            });
            continue;
          }

          // Create new user
          const newUser = new User({
            name: userData.name.trim(),
            email: userData.email.trim().toLowerCase(),
            level: parseInt(userData.level),
            schoolName: userData.schoolName.trim(),
            title: userData.title ? userData.title.trim() : '',
            isActive: true,
            canCollaborate: true,
            collaborationLevel: 'edit'
          });

          await newUser.save();
          results.successCount++;

        } catch (error) {
          results.errorCount++;
          results.errors.push({
            row: i + batch.indexOf(userData) + 2,
            message: `Database error: ${error.message}`
          });
        }
      }

      // Small delay between batches to be gentle on the database
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return NextResponse.json({
      message: 'Bulk import completed',
      ...results
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ 
      error: 'Internal server error during bulk import' 
    }, { status: 500 });
  }
}
