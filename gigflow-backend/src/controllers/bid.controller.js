import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { io } from "../server.js";

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price)
      return res.status(400).json({ message: "All fields required" });

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open")
      return res.status(400).json({ message: "Gig not available" });

    if (gig.ownerId.toString() === req.user.id)
      return res.status(400).json({ message: "Cannot bid on your own gig" });
    const existingBid = await Bid.findOne({
    gigId,
    freelancerId: req.user.id
});

    if (existingBid)
      return res.status(400).json({ message: "Already bid on this gig" });

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price
    });

    // Send notification to gig owner
    io.to(gig.ownerId.toString()).emit("bid_received", {
      gigTitle: gig.title,
      bidderName: req.user.name || req.user.email
    });

    res.status(201).json(bid);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig)
      return res.status(404).json({ message: "Gig not found" });

    if (gig.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).session(session);
    if (!bid)
      throw new Error("Bid not found");

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig)
      throw new Error("Gig not found");

    if (gig.ownerId.toString() !== req.user.id)
      throw new Error("Not authorized");

    if (gig.status === "assigned")
      throw new Error("Gig already assigned");

    gig.status = "assigned";
    await gig.save({ session });

    bid.status = "hired";
    await bid.save({ session });

    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id }
      },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    io.to(bid.freelancerId.toString()).emit("hired", {
      gigTitle: gig.title
    });

    res.json({ message: "Freelancer hired successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};
export const getReceivedBids = async (req, res) => {
  try {
    // find gigs owned by user
    const gigs = await Gig.find({ ownerId: req.user.id }).select("_id");

    const gigIds = gigs.map(g => g._id);

    const bids = await Bid.find({ gigId: { $in: gigIds } })
      .populate("freelancerId", "name email")
      .populate("gigId", "title")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

