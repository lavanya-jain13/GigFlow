import Gig from "../models/Gig.js";

export const getGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      status: "open",
      title: { $regex: search, $options: "i" }
    }).populate('ownerId', 'name email')
    .sort({ createdAt: -1 });

    res.json(gigs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget)
      return res.status(400).json({ message: "All fields required" });

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id
    });

    res.status(201).json(gig);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
