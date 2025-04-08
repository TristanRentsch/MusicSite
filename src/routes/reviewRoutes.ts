import express from "express";
import { createReview, updateReview, deleteReview } from "../controllers/reviewController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createReview);
router.put("/:reviewId", authenticate, updateReview);
router.delete("/:reviewId", authenticate, deleteReview);

export default router;
