import express from "express";
const router = express.Router();
import { login, register, logout, getUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/checkAuth.js";



router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-user", verifyToken, getUser);






export default router;