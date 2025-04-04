import { Request, Response } from "express";
import Album from "../models/Album";

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { title, artist, year, genre, imageUrl } = req.body;

    const album = await Album.create({ title, artist, year, genre, imageUrl });

    res.status(201).json(album);
  } catch (err) {
    console.error("Album creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
