import express from "express";
import cors from "cors";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/notify", notificationRouter);

export default app;
