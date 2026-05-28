import { matchedData } from "express-validator";
import { editMessageById, getMessageById } from "../../../models/message.js";
import { messageValidations } from "../../validations/message.js";
import { validateRequest } from "../../validations/validate.js";
import { AppError } from "../../../helper/AppErr.js";

export const updateMsg = [
  messageValidations,
  validateRequest,
  async (req, res, next) => {
    const userId = Number(req.user.id);
    const messageId = Number(req.params.messageId);

    try {
      const { message } = matchedData(req);
      const msgToUpdate = await getMessageById(messageId);

      if (!msgToUpdate) throw new AppError("Message does not exist!", 404);

      if (msgToUpdate.authorId === userId) {
        const updatedMsg = await editMessageById(messageId, message);
        return res.status(200).json({
          success: true,
          data: updatedMsg,
        });
      } else {
        throw new AppError("You are not permitted to perform this action", 403);
      }
    } catch (error) {
      console.error("update msg", error);
      next(error);
    }
  },
];
