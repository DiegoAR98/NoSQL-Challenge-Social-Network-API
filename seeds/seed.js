const mongoose = require('mongoose'); 
const User = require('../models/User');
const Thought = require('../models/Thought'); 

// Define some sample users
const userData = [
    {
        username: 'user1',
        email: 'user1@example.com',
    },
    {
        username: 'user2',
        email: 'user2@example.com',
    }
];

// Define some reactions (will be used within thoughts)
const reactionData = [
    {
        reactionBody: "That's very interesting!",
        username: 'user1',
    },
    {
        reactionBody: 'I totally agree with this.',
        username: 'user2',
    }
];

// Define thoughts, initially without reactions
const thoughtData = [
    {
        thoughtText: 'Here is a thought...',
        username: 'user1',
    },
    {
        thoughtText: 'Another interesting thought.',
        username: 'user2',
    }
];

const seedDatabase = async () => {
    await mongoose.connect('mongodb://localhost:27017/socialNetworkAPI', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Create users first
        const createdUsers = await User.insertMany(userData);

        // Update thoughtData with reactions and username from createdUsers
        const updatedThoughtData = thoughtData.map((thought, index) => {
            return {
                ...thought,
                username: createdUsers[index].username,
                reactions: reactionData // Assuming you want to add the same reactions to each thought
            };
        });

        // Create thoughts
        await Thought.insertMany(updatedThoughtData);

        console.log('Database seeded! Users and Thoughts created.');
    } catch (err) {
        console.error('Failed to seed database:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
