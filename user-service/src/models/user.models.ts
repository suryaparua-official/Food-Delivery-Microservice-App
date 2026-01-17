import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  mobile: string;
  role: "user" | "owner" | "deliveryBoy";
  resetOtp?: string;
  isOtpVerified: boolean;
  otpExpires?: Number;
  socketId?: string;
  isOnline: boolean;
  location?: {
    type: "Point";
    coordinates: number[];
  };
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    mobile: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true,
    },
    resetOtp: String,
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Number,
    },
    socketId: {
      type: String,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.model<IUser>("User", userSchema);
export default User;
