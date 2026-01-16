import express from "express";
import cors from "cors";
import deliveryRouter from "./routes/delivery.routes.js";

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

app.use("/api/delivery", deliveryRouter);

export default app;
