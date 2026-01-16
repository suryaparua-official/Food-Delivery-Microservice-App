import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./config/db.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5004;

app.listen(port, () => {
  connectDb();
  console.log(`Restaurant service running on port ${port}`);
});
