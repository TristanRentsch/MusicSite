import { Request, Response } from "express";
import Album from "../models/Album";
import Review from "../models/Review";
import fs from "fs";
import path from "path";


export const createAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, artist, year, genre } = req.body;
    const albumArt = req.file?.path;

    if (!albumArt) {
      res.status(400).json({ message: "Cover image is required" });
      return;
    }

    const album = await Album.create({ title, artist, year, genre, albumArt });

    res.status(201).json(album);
  } catch (err) {
    console.error("Album creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    console.error("Get all albums error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAlbumWithReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);
    if (!album) {
      res.status(404).json({ message: "Album not found" });
      return;
    }

    const reviews = await Review.find({ album: id }).populate("user", "username");

    res.status(200).json({ album, reviews });
  } catch (err) {
    console.error("Get album error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const album = await Album.findById(id);
    if (!album) {
      res.status(404).json({ message: "Album not found" });
      return;
    } 

    // If a new cover image is uploaded
    if (req.file) {
      // Delete the old image
      if (album.albumArt) {
        const oldImagePath = path.join(__dirname, "..", "..", album.albumArt);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Deleted old image:", oldImagePath);
          }
        });
      }

      // Set new image path
      updates.coverImage = req.file.path;
    }

    const updatedAlbum = await Album.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json(updatedAlbum);
  } catch (err) {
    console.error("Update album error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);
    if (!album) {
      res.status(404).json({ message: "Album not found" });
      return;
    } 

    // Delete the album cover image from disk
    if (album.albumArt) {
      const imagePath = path.join(__dirname, "..", "..", album.albumArt);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Deleted image:", imagePath);
        }
      });
    }

    await Review.deleteMany({ album: id }); // Delete Reviews

    // Delete the album
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album and associated reviews deleted" });
  } catch (err) {
    console.error("Delete album error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
