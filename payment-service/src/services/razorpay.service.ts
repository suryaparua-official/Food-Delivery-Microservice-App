import Razorpay from "razorpay";

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are missing in env");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

export const createRazorpayOrder = async (amount: number) => {
  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  return order;
};

export const verifyRazorpayPayment = async (paymentId: string) => {
  const razorpay = getRazorpayInstance();

  const payment = await razorpay.payments.fetch(paymentId);
  return payment.status === "captured";
};
