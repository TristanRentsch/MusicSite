import express from "express";
import { createReview } from "../controllers/reviewController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createReview);

export default router;
