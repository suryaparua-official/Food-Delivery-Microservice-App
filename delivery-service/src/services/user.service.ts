import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001/api/user";

export const getNearbyDeliveryBoys = async (
  longitude: number,
  latitude: number
) => {
  const res = await axios.get(
    `${USER_SERVICE_URL}/nearby-delivery-boys`,
    { params: { longitude, latitude } }
  );
  return res.data as string[];
};
