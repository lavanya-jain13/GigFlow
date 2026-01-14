import express from "express";
import {
  createBid,
  getBidsForGig,
  hireBid,
  getReceivedBids
} from "../controllers/bid.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBid);
router.get("/received", protect, async (req, res) => {
  const bids = await Bid.find()
    .populate("gigId")
    .populate("freelancerId", "name email")
    .where("gigId.ownerId").equals(req.user.id);

  res.json(bids);
});
router.get("/:gigId", protect, getBidsForGig);
router.patch("/:bidId/hire", protect, hireBid);

export default router;
