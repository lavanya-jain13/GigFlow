import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gig from './src/models/Gig.js';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();

const seedGigs = async () => {
  try {
    await connectDB();

    // Check if there's at least one user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      process.exit(0);
    }

    // Check if there are already gigs
    const existingGigs = await Gig.countDocuments();
    if (existingGigs > 0) {
      console.log(`Already have ${existingGigs} gigs in the database.`);
      const gigs = await Gig.find({}).populate('ownerId', 'name email');
      gigs.forEach((gig, index) => {
        console.log(`${index + 1}. ${gig.title} - ${gig.status} - Owner: ${gig.ownerId?.name || 'Unknown'}`);
      });
      process.exit(0);
    }

    // Create some test gigs
    const testGigs = [
      {
        title: 'Build a React Dashboard',
        description: 'Need a skilled React developer to build a comprehensive dashboard with charts and data visualization.',
        budget: 1500,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'Node.js API Development',
        description: 'Looking for a backend developer to create RESTful APIs using Node.js and Express.',
        budget: 1200,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'Mobile App UI/UX Design',
        description: 'Design beautiful and intuitive user interfaces for a mobile application.',
        budget: 800,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'Database Optimization',
        description: 'Optimize MongoDB queries and improve database performance for a high-traffic application.',
        budget: 600,
        ownerId: user._id,
        status: 'open'
      }
    ];

    await Gig.insertMany(testGigs);
    console.log(`✅ Created ${testGigs.length} test gigs!`);

    // Show the created gigs
    const gigs = await Gig.find({}).populate('ownerId', 'name email');
    gigs.forEach((gig, index) => {
      console.log(`${index + 1}. ${gig.title} - ${gig.status} - Owner: ${gig.ownerId?.name || 'Unknown'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedGigs();
