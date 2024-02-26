import { UserModel } from "../models/user-schema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import user from "./data/karyawan.json" assert { type: "json" };
dotenv.config();

const insertUsers = async (userData) => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);

    // Enkripsi password untuk setiap pengguna
    const hashedUsers = userData.map((user) => {
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      return { ...user, password: hashedPassword };
    });

    const result = await UserModel.insertMany(hashedUsers, {
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
