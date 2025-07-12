const mongoose = require('mongoose');
require('dotenv').config({ path: './Backend/config.env' });

async function testSwaps() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Swap = require('./Backend/models/Swap');
    const User = require('./Backend/models/User');
    
    // Get all swaps
    const swaps = await Swap.find()
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('offeredSkill', 'name')
      .populate('requestedSkill', 'name');
    
    console.log(`Found ${swaps.length} total swaps in database`);
    
    if (swaps.length > 0) {
      console.log('Sample swap:', JSON.stringify(swaps[0], null, 2));
    }
    
    // Get all users
    const users = await User.find().select('name email');
    console.log(`Found ${users.length} total users in database`);
    
    if (users.length > 0) {
      console.log('Sample user:', JSON.stringify(users[0], null, 2));
    }
    
    // Test with a specific user ID if there are users
    if (users.length > 0) {
      const testUserId = users[0]._id.toString();
      console.log(`Testing with user ID: ${testUserId}`);
      
      const userSwaps = await Swap.find({
        $or: [
          { fromUser: testUserId },
          { toUser: testUserId }
        ]
      }).populate('fromUser', 'name email').populate('toUser', 'name email');
      
      console.log(`Found ${userSwaps.length} swaps for user ${testUserId}`);
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testSwaps(); 