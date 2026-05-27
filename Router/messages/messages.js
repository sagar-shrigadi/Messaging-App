import { Router } from "express";
import { updateMsg } from "../../controller/chats/message/update.js";
import { deleteMsg } from "../../controller/chats/message/delete.js";

export const messages = Router();

messages.put("/:messageId", updateMsg);
messages.delete("/:messageId", deleteMsg);
