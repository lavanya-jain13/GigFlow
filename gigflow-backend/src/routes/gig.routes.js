import express from "express";
import { getGigs, createGig } from "../controllers/gig.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import Gig from "../models/Gig.js";

const router = express.Router();

router.get("/my", protect, async (req, res) => {
  const gigs = await Gig.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  res.json(gigs);
});


router.get("/", getGigs);
router.post("/", protect, createGig);

export default router;
