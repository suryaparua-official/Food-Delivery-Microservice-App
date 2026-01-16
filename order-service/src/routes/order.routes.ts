import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  placeOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  markDeliveredInternal,
} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/place-order", isAuth, placeOrder);
router.post("/verify-payment", isAuth, verifyPayment);
router.get("/my-orders", isAuth, getMyOrders);
router.get("/get-order/:orderId", isAuth, getOrderById);
router.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
router.post("/internal/mark-delivered", markDeliveredInternal);

export default router;
