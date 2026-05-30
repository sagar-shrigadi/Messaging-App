import { Router } from "express";
import { postGlobalMsg } from "../../controller/chats/global/create.js";
import { userMsg } from "./user/user.js";
import { getGlobalMsgs } from "../../controller/chats/global/read.js";
import { authenticateToken } from "../../controller/auth/authenticateToken.js";

export const chat = Router();

chat.get("/global", getGlobalMsgs);

chat.use(authenticateToken); // secured routes below, require valid token to access
chat.post("/global", postGlobalMsg);
chat.use("/users", userMsg);
