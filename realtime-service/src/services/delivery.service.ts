import axios from "axios";

const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || "http://localhost:5005/api/delivery";

/* inform delivery service about live location */
export const notifyDeliveryLocation = async (
  deliveryBoyId: string,
  latitude: number,
  longitude: number
) => {
  await axios.post(`${DELIVERY_SERVICE_URL}/internal/location-update`, {
    deliveryBoyId,
    latitude,
    longitude,
  });
};
