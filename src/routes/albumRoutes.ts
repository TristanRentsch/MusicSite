import express from "express";
import { authorizeRole } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload";
import { updateAlbum, deleteAlbum, createAlbum, getAllAlbums, getAlbumWithReviews } from "../controllers/albumController";

const router = express.Router();
router.post("/", authorizeRole(["basic, admin"]), upload.single("albumArt"), createAlbum);
router.get("/", getAllAlbums);
router.get("/:id", getAlbumWithReviews);
router.put("/:id", authorizeRole(["basic, admin"]), upload.single("albumArt"), updateAlbum);
router.delete("/:id", authorizeRole(["admin"]), deleteAlbum);

export default router;
