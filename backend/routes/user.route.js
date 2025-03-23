import express from "express";
const router = express.Router();
import {getUserProfile, followAndUnfollowUser, getSuggestedUsers, updateUserProfile, UsersWeAreFollowing, SendMessage, GetMessage} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/checkAuth.js";

router.get("/profile/:username",  verifyToken, getUserProfile);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.post("/follow/:id", verifyToken, followAndUnfollowUser);
router.post("/update", verifyToken, updateUserProfile);
router.get("/following", verifyToken, UsersWeAreFollowing);
router.post("/message/:id", verifyToken, SendMessage);
router.get("/message/:id", verifyToken, GetMessage);















export default router;