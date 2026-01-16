import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./config/db.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5002;

app.listen(port, () => {
  connectDb();
  console.log(`Order service running on port ${port}`);
});
