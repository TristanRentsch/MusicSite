import express from "express";
import { createAlbum } from "../controllers/albumController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createAlbum);

export default router;
