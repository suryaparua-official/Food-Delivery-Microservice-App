import express from "express";
import {
  getCurrentUser,
  updateUserLocation,
  getUserByEmail,
  createUser,
  updateOtp,
  resetUserPassword,
  setSocketOnline,
  updateSocketLocation,
  setSocketOffline,
  getNearbyDeliveryBoys,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

{
  /* ====== user-service own routes ====== */
}
userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);

{
  /* ====== auth-service support routes ====== */
}
userRouter.get("/by-email/:email", getUserByEmail);
userRouter.post("/", createUser);
userRouter.patch("/otp", updateOtp);
userRouter.patch("/reset-password", resetUserPassword);

userRouter.get("/nearby-delivery-boys", getNearbyDeliveryBoys);

{
  /* ====== socket-service support routes ====== */
}
userRouter.patch("/socket/online", setSocketOnline);
userRouter.patch("/socket/location", updateSocketLocation);
userRouter.patch("/socket/offline", setSocketOffline);

export default userRouter;
