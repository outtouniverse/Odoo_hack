require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('-password');
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Created: ${user.createdAt}`);
    });

    // Check specific user
    const testUser = await User.findOne({ email: 'xyz@gmail.com' });
    if (testUser) {
      console.log('\nFound user xyz@gmail.com:', {
        id: testUser._id,
        email: testUser.email,
        name: testUser.name,
        createdAt: testUser.createdAt
      });
    } else {
      console.log('\nUser xyz@gmail.com not found in database');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkUsers(); 