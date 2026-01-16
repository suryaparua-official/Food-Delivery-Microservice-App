import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import restaurantRouter from "./routes/restaurant.routes.js";
import itemRouter from "./routes/item.routes.js"



const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/restaurant", restaurantRouter);
app.use("/api/item", itemRouter)

export default app;
