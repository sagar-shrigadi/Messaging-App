import { Router } from "express";
import { auth } from "./auth/auth.js";
import { authenticateToken } from "../controller/auth/authenticateToken.js";
import { profile } from "../controller/profile.js";
import { readGlobalMsg } from "../controller/message/global/read.js";
import { chat } from "./chat/chat.js";

export const api = Router();

api.use("/auth/user", auth);
api.get("/chats/global", readGlobalMsg);
api.use(authenticateToken);
api.get("/user/profile", profile);
api.use("/chats", chat);
api.get("/", (req, res) => res.send("index route"));
