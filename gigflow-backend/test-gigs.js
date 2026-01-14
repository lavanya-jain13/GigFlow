import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const checkGigs = async () => {
  try {
    await connectDB();

    const Gig = mongoose.model('Gig', {
      title: String,
      description: String,
      budget: Number,
      ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["open", "assigned"], default: "open" }
    }, 'gigs');

    const gigs = await Gig.find({}).populate('ownerId', 'name email');
    console.log(`Found ${gigs.length} gigs:`);
    gigs.forEach((gig, index) => {
      console.log(`${index + 1}. ${gig.title} - ${gig.status} - Owner: ${gig.ownerId?.name || 'Unknown'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkGigs();
