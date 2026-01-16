import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:5001/api/user";

/* save socket + online status */
export const setUserOnline = async (userId: string, socketId: string) => {
  await axios.patch(`${USER_SERVICE_URL}/socket/online`, {
    userId,
    socketId,
  });
};

/* update location */
export const updateUserLocation = async (
  userId: string,
  latitude: number,
  longitude: number,
  socketId: string
) => {
  await axios.patch(`${USER_SERVICE_URL}/socket/location`, {
    userId,
    latitude,
    longitude,
    socketId,
  });
};

/* disconnect */
export const setUserOffline = async (socketId: string) => {
  await axios.patch(`${USER_SERVICE_URL}/socket/offline`, { socketId });
};
