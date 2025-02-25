import express from "express"
const app = express();
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT || 8000;


//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);










app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on PORT: ${PORT}`);
});