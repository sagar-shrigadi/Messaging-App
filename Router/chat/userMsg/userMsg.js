import { Router } from "express";
import { getMsgBetweenUsers } from "../../../controller/message/user/read.js";
import { postMsgToUser } from "../../../controller/message/user/create.js";
import { updateUserMsg } from "../../../controller/message/user/update.js";
import { deleteUserMsg } from "../../../controller/message/user/delete.js";

export const userMsg = Router({ mergeParams: true });

userMsg.get("/", getMsgBetweenUsers);
userMsg.post("/", postMsgToUser);
userMsg.put("/:messageId", updateUserMsg);
userMsg.delete("/:messageId", deleteUserMsg);
