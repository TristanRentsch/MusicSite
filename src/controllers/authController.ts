import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import BannedIP from "../models/BannedIP";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Get IP address
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Check if the IP is banned
    const banned = await BannedIP.findOne({ ip: ipAddress });
    if (banned) {
      res.status(403).json({ message: "Signup error" });
      return;
    }


    const existingUser = await User.findOne({$or: [{ email }, {username}] });
    if (existingUser) {
        res.status(400).json({ message: "Email or username already in use" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      ipAddress,
      lastKnownIP: ipAddress,
      role: "basic",
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    } 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    // Check if banned
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ipBanned = await BannedIP.findOne({ ip: ipAddress });
    if (ipBanned || user.banned) {
      res.status(403).json({ message: "Invalid credentials" });
      return;
    }


    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Server error" });
  }
};
