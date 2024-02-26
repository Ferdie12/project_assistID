import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const { COMPANY = "A" } = process.env;

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  position: { type: String, required: true },
  role: { type: String, default: "EMPLOYEE", select: false },
  company: { type: String, default: COMPANY, select: false },
  createdAt: { type: Date, default: Date.now, select: false },
});

export const UserModel = mongoose.model("User", UserSchema);
