import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  text: String,
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
