import { Router } from "express";
import { createGlobalMsg } from "../../../controller/message/global/create.js";
import { updateGlobalMsg } from "../../../controller/message/global/update.js";
import { deleteGlobalMsg } from "../../../controller/message/global/delete.js";

export const globalMsg = Router();

globalMsg.post("/", createGlobalMsg);
globalMsg.put("/:messageId", updateGlobalMsg);
globalMsg.delete("/:messageId", deleteGlobalMsg);
