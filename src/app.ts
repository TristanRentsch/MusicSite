import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Welcome to the Album Review API!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
