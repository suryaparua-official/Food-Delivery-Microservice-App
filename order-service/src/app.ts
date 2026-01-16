import express from "express";
import cors from "cors";
import orderRouter from "./routes/order.routes.js";

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

app.use("/api/order", orderRouter);

export default app;
