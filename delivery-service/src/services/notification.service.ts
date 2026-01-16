import axios from "axios";

const NOTIFY_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5007/api/notify";

export const sendOtpMail = async (email: string, otp: string) => {
  await axios.post(`${NOTIFY_SERVICE_URL}/email`, {
    to: email,
    subject: "Delivery OTP",
    message: `Your delivery OTP is ${otp}`,
  });
};
