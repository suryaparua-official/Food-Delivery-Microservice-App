import axios from "axios";

const NOTIFY_SERVICE_URL =  process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5007/api/notify";

export const sendEmailNotification = async (
  to: string,
  subject: string,
  message: string
) => {
  await axios.post(`${NOTIFY_SERVICE_URL}/email`, {
    to,
    subject,
    message,
  });
};
