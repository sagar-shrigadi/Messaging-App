import { Router } from "express";
import { getMsgBetweenUsers } from "../../../controller/chats/users/read.js";
import { postMsgToUser } from "../../../controller/chats/users/create.js";

export const userMsg = Router({ mergeParams: true });

userMsg.get("/:toUserId", getMsgBetweenUsers);
userMsg.post("/:toUserId", postMsgToUser);
