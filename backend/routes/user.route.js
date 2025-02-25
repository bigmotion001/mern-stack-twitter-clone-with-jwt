import express from "express";
const router = express.Router();
import {getUserProfile, followAndUnfollowUser, getSuggestedUsers, updateUserProfile} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/checkAuth.js";

router.get("/userprofile/:username",  verifyToken, getUserProfile);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.post("/follow/:id", verifyToken, followAndUnfollowUser);
router.post("/update", verifyToken, updateUserProfile);















export default router;