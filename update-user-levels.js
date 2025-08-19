const { MongoClient } = require('mongodb');

// MongoDB connection string - UPDATE THIS WITH YOUR ACTUAL CONNECTION STRING
const MONGODB_URI = 'mongodb+srv://jjaramillo7:IIb0AAysshoskZ9G@cluster0.ld91pw7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'd79-directory';

async function updateUserLevels() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // First, let's see what users we have
    const allUsers = await usersCollection.find({}).toArray();
    console.log('\nCurrent users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}): Level ${user.level}, School: ${user.schoolName}`);
    });
    
    // Update user levels based on your requirements
    const updates = [
      // Super Admin (Level 5) - You can update this email to your super admin
      {
        email: 'jjaramillo7@schools.nyc.gov',
        newLevel: 5,
        description: 'Super Admin - Can see everything'
      },
      // Admin Principals (Level 4) - Update these emails to your admin principals
      // {
      //   email: 'principal1@schools.nyc.gov',
      //   newLevel: 4,
      //   description: 'Admin Principal - Can create forms and manage users'
      // },
      // Assistant Principals (Level 3) - Update these emails
      // {
      //   email: 'assistant1@schools.nyc.gov',
      //   newLevel: 3,
      //   description: 'Assistant Principal - Can edit assigned forms'
      // },
      // Other Staff (Level 2) - Update these emails
      // {
      //   email: 'staff1@schools.nyc.gov',
      //   newLevel: 2,
      //   description: 'Other Staff - Can view assigned forms'
      // },
      // Viewers (Level 1) - Update these emails
      // {
      //   email: 'viewer1@schools.nyc.gov',
      //   newLevel: 1,
      //   description: 'Viewer - Can only view assigned forms'
      // }
    ];
    
    console.log('\nUpdating user levels...');
    
    for (const update of updates) {
      const result = await usersCollection.updateOne(
        { email: update.email },
        { 
          $set: { 
            level: update.newLevel,
            title: update.description
          }
        }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${update.email} to Level ${update.newLevel} (${update.description})`);
      } else {
        console.log(`❌ User ${update.email} not found`);
      }
    }
    
    // Show final user list
    console.log('\nUpdated users in database:');
    const updatedUsers = await usersCollection.find({}).toArray();
    updatedUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}): Level ${user.level}, School: ${user.schoolName}`);
    });
    
    console.log('\n✅ User level updates completed!');
    
  } catch (error) {
    console.error('Error updating user levels:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updateUserLevels();
