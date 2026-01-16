import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
  userId?: Types.ObjectId;
}

const isAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) return res.status(401).json({ message: "token not found" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    req.userId = new Types.ObjectId(decoded.userId);

    next();
  } catch {
    return res.status(401).json({ message: "invalid token" });
  }
};

export default isAuth;
