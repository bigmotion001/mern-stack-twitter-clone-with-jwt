import express from "express";
const router = express.Router();
import { login, register, logout } from "../controllers/auth.controller.js";


router.post("/register", register);
router.post("/login", login);
router.post("/login", logout);






export default router;