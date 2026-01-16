import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { socketHandler } from "./socket.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

socketHandler(io);

const port = process.env.PORT ? Number(process.env.PORT) : 5006;

server.listen(port, () => {
  console.log(`Realtime service running on port ${port}`);
});
