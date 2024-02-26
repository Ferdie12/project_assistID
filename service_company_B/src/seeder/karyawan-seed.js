import { UserModel } from "../models/user-schema.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./data/karyawan.json" assert { type: "json" };
dotenv.config();

const insertUsers = async (userData) => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    const result = await UserModel.insertMany(userData, {
      bufferCommands: false,
    });
    console.log("Data inserted successfully:", result);
    await mongoose.disconnect(process.env.DATABASE_URI);
    return result;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
};

insertUsers(user);
