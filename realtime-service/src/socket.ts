import { Server } from "socket.io";
import {
  setUserOnline,
  updateUserLocation,
  setUserOffline,
} from "./services/user.service.js";
import { notifyDeliveryLocation } from "./services/delivery.service.js";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /* ================= identity ================= */
    socket.on("identity", async ({ userId }) => {
      try {
        await setUserOnline(userId, socket.id);
      } catch (error) {
        console.error("identity error", error);
      }
    });

    /* ================= updateLocation ================= */
    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      try {
        // 1) save in user-service
        await updateUserLocation(userId, latitude, longitude, socket.id);

        // 2) inform delivery-service
        await notifyDeliveryLocation(userId, latitude, longitude);

        // 3) broadcast to clients
        io.emit("updateDeliveryLocation", {
          deliveryBoyId: userId,
          latitude,
          longitude,
        });
      } catch (error) {
        console.error("updateLocation error", error);
      }
    });

    /* ================= disconnect ================= */
    socket.on("disconnect", async () => {
      try {
        await setUserOffline(socket.id);
      } catch (error) {
        console.error("disconnect error", error);
      }
    });
  });
};
