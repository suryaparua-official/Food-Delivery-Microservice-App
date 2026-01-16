import express from "express";
import { sendEmail } from "../controllers/notification.controllers.js";

const router = express.Router();

router.post("/email", sendEmail);

export default router;
