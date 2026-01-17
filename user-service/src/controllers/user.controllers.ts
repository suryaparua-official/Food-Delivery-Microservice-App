import type { Response, Request } from "express";
import User from "../models/user.models.js";

interface AuthRequest extends Request {
  userId?: string;
}

{
  /*===================== Get Current User ============================ */
}
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

{
  /*======================== Update User Location =========================== */
}
export const updateUserLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lon } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
      { new: true },
    );

    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }

    return res.status(200).json({ message: "location updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `update location user error ${error}` });
  }
};

{
  /* ===================== Get User By Email (for auth-service) ========== ===== */
}
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: "get user by email error" });
  }
};

{
  /* ===================== Create User (for auth-service) ===================== */
}
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch {
    return res.status(500).json({ message: "create user error" });
  }
};

{
  /* ===================== Update OTP (for auth-service) ===================== */
}
export const updateOtp = async (req: Request, res: Response) => {
  try {
    const { email, resetOtp, otpExpires, isOtpVerified } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { resetOtp, otpExpires, isOtpVerified },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: "update otp error" });
  }
};

{
  /* ===================== Reset Password (for auth-service) ==================== */
}
export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { password, isOtpVerified: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "password updated" });
  } catch {
    return res.status(500).json({ message: "reset password error" });
  }
};

/* ================= Get Nearby Delivery Boys ================= */
export const getNearbyDeliveryBoys = async (req: Request, res: Response) => {
  try {
    const { longitude, latitude } = req.query;

    if (longitude == null || latitude == null) {
      return res.status(400).json({
        message: "longitude and latitude required",
      });
    }

    const lng = Number(longitude);
    const lat = Number(latitude);

    const users = await User.find({
      role: "deliveryBoy",
      isOnline: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000,
        },
      },
    }).select("_id");

    const ids = users.map((u) => u._id.toString());

    return res.status(200).json(ids);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `nearby delivery boys error ${error}` });
  }
};

/* ================= Socket Online ================= */
export const setSocketOnline = async (req: Request, res: Response) => {
  try {
    const { userId, socketId } = req.body;

    if (!userId || !socketId) {
      return res.status(400).json({ message: "userId and socketId required" });
    }

    await User.findByIdAndUpdate(userId, {
      socketId,
      isOnline: true,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "socket online error" });
  }
};

/* ================= Update Socket Location ================= */
export const updateSocketLocation = async (req: Request, res: Response) => {
  try {
    const { userId, latitude, longitude, socketId } = req.body;

    if (!userId || latitude == null || longitude == null || !socketId) {
      return res.status(400).json({
        message: "userId, latitude, longitude, socketId required",
      });
    }

    await User.findByIdAndUpdate(userId, {
      socketId,
      isOnline: true,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "update socket location error" });
  }
};

/* ================= Socket Offline ================= */
export const setSocketOffline = async (req: Request, res: Response) => {
  try {
    const { socketId } = req.body;

    if (!socketId) {
      return res.status(400).json({ message: "socketId required" });
    }

    await User.findOneAndUpdate(
      { socketId },
      { socketId: null, isOnline: false },
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "socket offline error" });
  }
};
