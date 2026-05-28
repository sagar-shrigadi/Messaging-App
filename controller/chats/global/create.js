import { matchedData } from "express-validator";
import { postGlobalMessage } from "../../../models/message.js";
import { messageValidations } from "../../validations/message.js";
import { validateRequest } from "../../validations/validate.js";

export const postGlobalMsg = [
  messageValidations,
  validateRequest,
  async (req, res, next) => {
    const userId = Number(req.user.id);
    try {
      const { message } = matchedData(req);
      const newGlobalMessage = await postGlobalMessage(userId, message);
      return res.status(201).json({ newMessage: newGlobalMessage });
    } catch (error) {
      console.error("create global message", error);
      next(error);
    }
  },
];
