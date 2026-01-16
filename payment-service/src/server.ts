import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5003;

app.listen(port, () => {
  console.log(`Payment service running on port ${port}`);
});
