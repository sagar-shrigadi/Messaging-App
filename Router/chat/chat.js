import { Router } from "express";
import { globalMsg } from "./globalMsg/globalMsg.js";
import { userMsg } from "./userMsg/userMsg.js";

export const chat = Router();

chat.use("/global", globalMsg);
chat.use("/:toUserId", userMsg);
