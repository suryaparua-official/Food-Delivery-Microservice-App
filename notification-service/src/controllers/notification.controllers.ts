import type { Request, Response } from "express";
import { transporter } from "../config/mail.js";

/* ================= Send Email ================= */
export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ message: "to, subject, message required" });
    }

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return res.status(200).json({ message: "email sent successfully" });
  } catch (error) {
    console.error("Email error =>", error);
    return res.status(500).json({ message: "email send failed" });
  }
};
