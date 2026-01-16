import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  assignDelivery,
  getAssignments,
  acceptAssignment,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  updateLiveLocation,
} from "../controllers/delivery.controllers.js";

const router = express.Router();

// Order Service → Delivery Service
router.post("/assign", assignDelivery);

// Delivery boy APIs
router.get("/assignments", isAuth, getAssignments);
router.post("/accept/:assignmentId", isAuth, acceptAssignment);
router.post("/send-otp", isAuth, sendDeliveryOtp);
router.post("/verify-otp", isAuth, verifyDeliveryOtp);
router.post("/internal/location-update", updateLiveLocation);

export default router;
