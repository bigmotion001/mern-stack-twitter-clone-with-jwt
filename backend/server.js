import express from "express"

import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import{app, server} from "./socket/socket.js";
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_USERNAME ,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});




const PORT = process.env.PORT;
app.use(cors({origin:"http://localhost:5173", credentials:true}))


const __dirname = path.resolve();




//middelware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification", notificationRoutes);





if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res)=>{
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
  }




server.listen(PORT, () => {
    connectDB();
    console.log(`Server started on PORT: ${PORT}`);
});