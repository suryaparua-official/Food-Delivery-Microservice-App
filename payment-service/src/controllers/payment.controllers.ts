import type { Request, Response } from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/razorpay.service.js";

/* ================= Create Payment ================= */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "invalid amount" });
    }

    const order = await createRazorpayOrder(amount);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("create payment error =>", error);
    return res.status(500).json({ message: "create payment error" });
  }
};

/* ================= Verify Payment ================= */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "paymentId required" });
    }

    const success = await verifyRazorpayPayment(paymentId);

    if (!success) {
      return res.status(400).json({ message: "payment not captured" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("verify payment error =>", error);
    return res.status(500).json({ message: "verify payment error" });
  }
};
