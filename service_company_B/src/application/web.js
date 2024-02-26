import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import router from "../routes/index.js";
import connectDB from "../config/dbConnect.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

dotenv.config();
connectDB();
export const web = express();
web.use(cors());
web.use(morgan("dev"));
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

web.use(router());

web.use(errorMiddleware);
