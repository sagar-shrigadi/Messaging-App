import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import { api } from "./Router/api.js";
import { errHandler } from "./controller/errHandler.js";
import { verifyToken } from "./helper/verifyToken.js";
import { AppError } from "./helper/AppErr.js";
import { postGlobalMessage, postMessageToUser } from "./models/message.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://messaging-client.pages.dev/",
  },
});
app.use(cors({ origin: "https://messaging-client.pages.dev/" }));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  // automatically join a global room
  socket.join("global");
  socket.on("global", async ({ token, message }) => {
    try {
      const decoded = verifyToken(token);
      const msg = await postGlobalMessage(decoded.id, message);
      io.to("global").emit("global", msg);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // user specific chat room
  socket.on("join-private", ({ userOne, userTwo }) => {
    const roomId = [userOne, userTwo].sort((a, b) => a - b).join("-");
    socket.join(roomId);
  });

  socket.on("private", async ({ token, message, targetUserId }) => {
    try {
      const decoded = verifyToken(token);
      const roomId = [decoded.id, targetUserId].sort((a, b) => a - b).join("-");
      const msg = await postMessageToUser(
        Number(decoded.id),
        Number(targetUserId),
        message,
      );
      io.to(roomId).emit("private", msg);
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

app.use(errHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`running on port ${PORT}`);
});
