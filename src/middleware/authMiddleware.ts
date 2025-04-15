import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

interface AuthRequest extends Request {
  userId?: string;
}

//Used to authenticate routes that user must be logged in to access
// export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     res.status(401).json({ message: "No token provided" });
//     return;
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };


//Ensure user has proper roll to use route
export const authorizeRole = (requiredRoles: string[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecret") as { userId: string };

      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      if (!requiredRoles.includes(user.role)) {
        res.status(403).json({ message: "Forbidden: insufficient permissions" });
        return;
      }

      (req as any).user = user;
      next();
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
};