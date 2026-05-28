import { matchedData } from "express-validator";
import { editMessageById, getMessageById } from "../../../models/message.js";
import { messageValidations } from "../../validations/message.js";
import { validateRequest } from "../../validations/validate.js";

export const updateMsg = [
  messageValidations,
  validateRequest,
  async (req, res, next) => {
    const userId = Number(req.user.id);
    const messageId = Number(req.params.messageId);

    try {
      const { message } = matchedData(req);
      const msgToUpdate = await getMessageById(messageId);

      if (msgToUpdate.authorId === userId) {
        const updatedMsg = await editMessageById(messageId, message);
        return res.json({ updatedMsg });
      } else {
        return res.status(403).end();
      }
    } catch (error) {
      console.error("update msg", error);
      next(error);
    }
  },
];
