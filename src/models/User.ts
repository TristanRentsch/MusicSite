import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["basic", "admin"],
    default: "basic",
  },
  banned: {type: Boolean, default: false},
  ipAddress: {type: String},
  lastKnownIP: {type: String},
}, {timestamps: true});

export default mongoose.model("User", userSchema);
