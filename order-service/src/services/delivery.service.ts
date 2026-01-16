import axios from "axios";

const DELIVERY_SERVICE_URL =  process.env.DELIVERY_SERVICE_URL || "http://localhost:5005/api/delivery";

export const assignDelivery = async (payload: any) => {
  await axios.post(`${DELIVERY_SERVICE_URL}/assign`, payload);
};
