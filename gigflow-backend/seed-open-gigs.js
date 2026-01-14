import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gig from './src/models/Gig.js';
import User from './src/models/User.js';
import connectDB from './src/config/db.js';

dotenv.config();

const seedOpenGigs = async () => {
  try {
    await connectDB();

    // Check if there's at least one user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      process.exit(0);
    }

    // Create some test gigs with status "open"
    const openGigs = [
      {
        title: 'React Frontend Development',
        description: 'Build a modern React application with TypeScript, Tailwind CSS, and responsive design.',
        budget: 2000,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'Full-Stack Web Application',
        description: 'Develop a complete web application using MERN stack (MongoDB, Express, React, Node.js).',
        budget: 3500,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'API Development & Integration',
        description: 'Create RESTful APIs and integrate with third-party services like Stripe and SendGrid.',
        budget: 1800,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'Mobile App Development',
        description: 'Build a cross-platform mobile app using React Native with Firebase backend.',
        budget: 2800,
        ownerId: user._id,
        status: 'open'
      },
      {
        title: 'UI/UX Design & Prototyping',
        description: 'Create beautiful user interfaces and interactive prototypes using Figma and Adobe XD.',
        budget: 1200,
        ownerId: user._id,
        status: 'open'
      }
    ];

    await Gig.insertMany(openGigs);
    console.log(`✅ Created ${openGigs.length} open gigs for testing!`);

    // Show all gigs (both open and assigned)
    const allGigs = await Gig.find({}).populate('ownerId', 'name email');
    console.log(`\n📊 Total gigs in database: ${allGigs.length}`);

    const openCount = allGigs.filter(gig => gig.status === 'open').length;
    const assignedCount = allGigs.filter(gig => gig.status === 'assigned').length;

    console.log(`🟢 Open gigs: ${openCount}`);
    console.log(`🔴 Assigned gigs: ${assignedCount}`);

    console.log('\n📋 Open gigs (visible in Find Work):');
    allGigs.filter(gig => gig.status === 'open').forEach((gig, index) => {
      console.log(`${index + 1}. ${gig.title} - ₹${gig.budget} - Owner: ${gig.ownerId?.name || 'Unknown'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedOpenGigs();
