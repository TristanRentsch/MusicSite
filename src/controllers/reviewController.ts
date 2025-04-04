import { Request, Response } from "express";
import Review from "../models/Review";
import Album from "../models/Album";

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId, rating, text } = req.body;
    const userId = (req as any).userId;

    const album = await Album.findById(albumId);
    if (!album) {
        res.status(404).json({ message: "Album not found" });
        return;
    } 

    const review = await Review.create({
      album: albumId,
      user: userId,
      rating,
      text,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
