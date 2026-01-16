import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = Number(process.env.PORT) || 5007;

app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});
