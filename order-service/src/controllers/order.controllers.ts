import type { Response } from "express";
import { Types } from "mongoose";
import Order from "../models/order.model.js";
import type { AuthRequest } from "../middlewares/isAuth.js";
import {
  createPayment,
  verifyPaymentAPI,
} from "../services/payment.service.js";
import { assignDelivery } from "../services/delivery.service.js";

/* ================= Place Order ================= */
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const groupItemsByShop: Record<string, any[]> = {};

    cartItems.forEach((item: any) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = Object.keys(groupItemsByShop).map((shopId) => {
      const items = groupItemsByShop[shopId];

      if (!items || items.length === 0) {
        throw new Error("Invalid cart items");
      }

      const subtotal = items.reduce(
        (sum, i) => sum + Number(i.price) * Number(i.quantity),
        0
      );

      return {
        shop: new Types.ObjectId(shopId),
        owner: new Types.ObjectId(items[0].owner),
        subtotal,
        shopOrderItems: items.map((i) => ({
          item: new Types.ObjectId(i.id),
          price: i.price,
          quantity: i.quantity,
          name: i.name,
        })),
      };
    });

    let razorpayOrder: any = null;

    if (paymentMethod === "online") {
      razorpayOrder = await createPayment(totalAmount);
    }

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
      razorpayOrderId: razorpayOrder?.orderId || "",
      payment: paymentMethod === "cod",
    });

    return res.status(201).json({
      orderId: newOrder._id,
      razorpayOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: `place order error ${error}` });
  }
};

/* ================= Verify Payment ================= */
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId, orderId } = req.body;

    const result = await verifyPaymentAPI(paymentId);
    if (!result.success) {
      return res.status(400).json({ message: "payment not verified" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(400).json({ message: "order not found" });

    order.payment = true;
    order.razorpayPaymentId = paymentId;
    await order.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: `verify payment error ${error}` });
  }
};

/* ================= Get My Orders ================= */
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: `get my orders error ${error}` });
  }
};

/* ================= Get Order By Id ================= */
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(400).json({ message: "order not found" });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `get order error ${error}` });
  }
};

/* ================= Update Order Status ================= */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(400).json({ message: "order not found" });

    const shopOrder = order.shopOrders.find(
      (o: any) => String(o.shop) === String(shopId)
    );

    if (!shopOrder)
      return res.status(400).json({ message: "shop order not found" });

    shopOrder.status = status;
    await order.save();

    if (status === "out of delivery") {
      await assignDelivery({
        orderId: order._id,
        shopId: shopOrder.shop,
        shopOrderId: shopOrder._id,
        deliveryAddress: order.deliveryAddress,
      });
    }

    return res.status(200).json({ shopOrder });
  } catch (error) {
    return res.status(500).json({ message: `order status error ${error}` });
  }
};

/* ================= Internal: Mark Delivered ================= */
export const markDeliveredInternal = async (req: any, res: Response) => {
  try {
    const { orderId, shopId, shopOrderId } = req.body;

    if (!orderId || !shopId || !shopOrderId) {
      return res.status(400).json({
        message: "orderId, shopId, shopOrderId required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(400).json({ message: "order not found" });

    const shopOrder = order.shopOrders.find(
      (o: any) => String(o._id) === String(shopOrderId)
    );

    if (!shopOrder)
      return res.status(400).json({ message: "shop order not found" });

    shopOrder.status = "delivered";
    await order.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: `mark delivered error ${error}` });
  }
};
