const connectDB = require('../lib/mongodb');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    // Clear existing users (optional - remove this if you want to preserve existing data)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Define the specific users
    const users = [
      {
        name: 'Sarada Dorce',
        email: 'sdorce@schools.nyc.gov',
        level: 3, // Principal level
        schoolName: 'Sample School NYC',
        isActive: true,
        title: 'Principal',
      },
      {
        name: 'Randy Cole',
        email: 'rcole@schools.nyc.gov',
        level: 3, // Principal level
        schoolName: 'School 1',
        isActive: true,
        title: 'Principal',
      },
      {
        name: 'Javier Jaramillo',
        email: 'jjaramillo7@schools.nyc.gov', 
        level: 4, // Admin level
        schoolName: 'District 79 Administration',
        isActive: true,
      },
    ];

    console.log('Creating users...');
    
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, updating...`);
        // Update existing user
        await User.findOneAndUpdate(
          { email: userData.email },
          userData,
          { new: true }
        );
      } else {
        console.log(`Creating new user: ${userData.email}`);
        // Create new user
        const newUser = new User(userData);
        await newUser.save();
      }
    }

    console.log('✅ Users seeded successfully!');
    console.log('\n👤 Created/Updated Users:');
    console.log('1. SDorce@schools.nyc.gov (Level 3 - Principal)');
    console.log('2. jjaramillo7@schools.nyc.gov (Level 4 - Admin)');
    console.log('\n🔐 Authentication Setup:');
    console.log('- These users can now sign in with Google OAuth');
    console.log('- Email domain restriction: @schools.nyc.gov only');
    console.log('- Level-based access control implemented');

    // Display all users
    const allUsers = await User.find({});
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`   ${user.email} - Level ${user.level} - ${user.name}`);
    });

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    process.exit(0);
  }
};

// Run the seeding function
seedUsers();