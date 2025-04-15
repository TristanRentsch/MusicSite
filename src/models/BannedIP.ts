import mongoose from "mongoose";

const bannedIPSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
});

const BannedIP = mongoose.model("BannedIP", bannedIPSchema);
export default BannedIP;
