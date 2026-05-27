import { Router } from "express";
import { postGlobalMsg } from "../../controller/chats/global/create.js";
import { userMsg } from "./user/user.js";

export const chat = Router();

chat.post("/global", postGlobalMsg);
chat.use("/users", userMsg);
