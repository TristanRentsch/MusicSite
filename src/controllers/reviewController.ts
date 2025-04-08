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

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const userId = (req as any).userId;
    const { rating, text } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    if (review.user.toString() !== userId) {
      res.status(403).json({ message: "Not authorized" });
      return 
    }

    review.rating = rating ?? review.rating;
    review.text = text ?? review.text;

    await review.save();
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const userId = (req as any).userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    } 

    if (review.user.toString() !== userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


