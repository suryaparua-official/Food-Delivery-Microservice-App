import type { Response } from "express";
import { Types } from "mongoose";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import type { AuthRequest } from "../middlewares/isAuth.js";
import { getNearbyDeliveryBoys } from "../services/user.service.js";
import { sendOtpMail } from "../services/notification.service.js";
import { markDelivered } from "../services/order.service.js";

/* ================= Assign Delivery (called from Order Service) ================= */
export const assignDelivery = async (req: any, res: Response) => {
  try {
    const { orderId, shopId, shopOrderId, deliveryAddress } = req.body;

    const { longitude, latitude } = deliveryAddress;

    const nearbyBoys = await getNearbyDeliveryBoys(longitude, latitude);

    if (!nearbyBoys || nearbyBoys.length === 0) {
      return res.json({
        message: "order ready but no delivery boys available",
      });
    }

    const assignment = await DeliveryAssignment.create({
      order: new Types.ObjectId(orderId),
      shop: new Types.ObjectId(shopId),
      shopOrderId: new Types.ObjectId(shopOrderId),
      brodcastedTo: nearbyBoys.map((id) => new Types.ObjectId(id)),
      status: "brodcasted",
    });

    return res.status(201).json({
      assignmentId: assignment._id,
      brodcastedTo: nearbyBoys,
    });
  } catch (error) {
    return res.status(500).json({ message: `assign delivery error ${error}` });
  }
};

/* ================= Get Assignments (delivery boy) ================= */
export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "unauthorized" });

    const assignments = await DeliveryAssignment.find({
      brodcastedTo: req.userId,
      status: "brodcasted",
    });

    return res.status(200).json(assignments);
  } catch (error) {
    return res.status(500).json({ message: `get assignments error ${error}` });
  }
};

/* ================= Accept Assignment ================= */
export const acceptAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.params;

    if (!req.userId) return res.status(401).json({ message: "unauthorized" });

    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment)
      return res.status(400).json({ message: "assignment not found" });

    if (assignment.status !== "brodcasted") {
      return res.status(400).json({ message: "assignment expired" });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    await assignment.save();

    return res.status(200).json({ message: "order accepted" });
  } catch (error) {
    return res.status(500).json({ message: `accept order error ${error}` });
  }
};

/* ================= Send Delivery OTP ================= */
export const sendDeliveryOtp = async (req: AuthRequest, res: Response) => {
  try {
    const { userEmail } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await sendOtpMail(userEmail, otp);

    return res.status(200).json({ message: "otp sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: `send otp error ${error}` });
  }
};

/* ================= Verify Delivery OTP ================= */
export const verifyDeliveryOtp = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, shopId, shopOrderId } = req.body;

    if (!req.userId) return res.status(401).json({ message: "unauthorized" });

    // Order service এ status update
    await markDelivered(orderId, shopId, shopOrderId);

    const assignment = await DeliveryAssignment.findOne({
      order: orderId,
      shopOrderId,
      assignedTo: req.userId,
    });

    if (assignment) {
      assignment.status = "completed";
      await assignment.save();
    }

    return res.status(200).json({ message: "order delivered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `verify delivery otp error ${error}` });
  }
};

/* ================= Internal: Update Live Location ================= */
export const updateLiveLocation = async (req: any, res: Response) => {
  try {
    const { deliveryBoyId, latitude, longitude } = req.body;

    if (!deliveryBoyId || latitude == null || longitude == null) {
      return res.status(400).json({
        message: "deliveryBoyId, latitude, longitude required",
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: `location update error ${error}` });
  }
};
