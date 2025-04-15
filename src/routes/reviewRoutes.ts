import express from "express";
import { createReview, updateReview, deleteReview } from "../controllers/reviewController";
import { authorizeRole } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authorizeRole(["basic, admin"]), createReview);
router.put("/:reviewId", authorizeRole(["basic, admin"]), updateReview);
router.delete("/:reviewId", authorizeRole(["basic, admin"]), deleteReview);

export default router;
