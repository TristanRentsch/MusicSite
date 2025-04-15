import { Request, Response } from "express";
import BannedIP from "../models/BannedIP";
import User from "../models/User";

export const ipBanUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userIP = user.ipAddress;
    const recentIP = user.lastKnownIP;

    if (userIP) {
      await BannedIP.create({ ip: userIP });
    }

    if(recentIP && recentIP != userIP) {
        await BannedIP.create({ ip: recentIP });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User banned and IP blocked" });
  } catch (err) {
    console.error("Ban user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.banned = true;
        await user.save();
        res.status(200).json({ message: "User banned" });
    } catch (err) {
      console.error("Ban user error:", err);
      res.status(500).json({ error: "Server error" });
    }
}