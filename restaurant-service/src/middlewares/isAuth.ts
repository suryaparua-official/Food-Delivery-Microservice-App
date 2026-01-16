import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "token not found" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    const authReq = req as AuthRequest;
    authReq.userId = decoded.userId;

    next();
  } catch (e) {
    console.log("JWT ERROR =>", e);
    return res.status(401).json({ message: "invalid token" });
  }
};

export default isAuth;
