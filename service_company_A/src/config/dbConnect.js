import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Sukses terhubung ke database MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
