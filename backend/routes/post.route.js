import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/checkAuth.js";
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts,getLikedPostByUser,postOfUsersWeFollowing, getUserPosts } from "../controllers/post.controller.js";

router.post("/create", verifyToken, createPost);
router.post("/like/:id", verifyToken, likeUnlikePost);
router.get("/likes/:id", verifyToken, getLikedPostByUser);
router.post("/comment/:id", verifyToken, commentOnPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.get("/all", verifyToken, getAllPosts);
router.get("/following", verifyToken, postOfUsersWeFollowing);
router.get("/user/:username", verifyToken, getUserPosts);




export default router;