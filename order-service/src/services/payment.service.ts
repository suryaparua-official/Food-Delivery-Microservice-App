import axios from "axios";

const PAYMENT_SERVICE_URL =  process.env.PAYMENT_SERVICE_URL || "http://localhost:5003/api/payment";

export const createPayment = async (amount: number) => {
  const res = await axios.post(`${PAYMENT_SERVICE_URL}/create`, { amount });
  return res.data;
};

export const verifyPaymentAPI = async (paymentId: string) => {
  const res = await axios.post(`${PAYMENT_SERVICE_URL}/verify`, { paymentId });
  return res.data;
};
