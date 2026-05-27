import { body, matchedData, validationResult } from "express-validator";
import { editMessageById, getMessageById } from "../../../models/message.js";
import { msgValidations } from "../global/create.js";

export const updateMsg = [
  msgValidations,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      return res.status(400).json({ error });
    }

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
