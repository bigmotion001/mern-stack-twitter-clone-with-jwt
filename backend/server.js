import express from "express"
const app = express();
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_USERNAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

dotenv.config();

const PORT = process.env.PORT || 8000;


//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);










app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on PORT: ${PORT}`);
});