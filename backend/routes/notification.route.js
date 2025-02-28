import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/checkAuth.js";
import { getAllNotification, deleteNotification } from "../controllers/notitcation.controller.js";


router.get("/all", verifyToken, getAllNotification)
router.delete("/delete", verifyToken, deleteNotification)





export default router;