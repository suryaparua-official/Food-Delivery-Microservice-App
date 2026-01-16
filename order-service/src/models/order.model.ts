import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: String,
  price: Number,
  quantity: Number,
});

const shopOrderSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true },
    subtotal: Number,
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "out of delivery", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },

    totalAmount: Number,

    shopOrders: [shopOrderSchema],

    payment: { type: Boolean, default: false },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
