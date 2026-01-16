import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:5002/api/order";

export const markDelivered = async (
  orderId: string,
  shopId: string,
  shopOrderId: string
) => {
  await axios.post(`${ORDER_SERVICE_URL}/internal/mark-delivered`, {
    orderId,
    shopId,
    shopOrderId,
  });
};
