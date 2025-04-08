import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload";
import { updateAlbum, deleteAlbum, createAlbum, getAllAlbums, getAlbumWithReviews } from "../controllers/albumController";

const router = express.Router();
router.post("/", authenticate, upload.single("albumArt"), createAlbum);
router.get("/", getAllAlbums);
router.get("/:id", getAlbumWithReviews);
router.put("/:id", authenticate, upload.single("albumArt"), updateAlbum);
router.delete("/:id", authenticate, deleteAlbum);

export default router;
