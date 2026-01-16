import express from "express";
import cors from "cors";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

app.use("/api/payment", paymentRouter);

export default app;
