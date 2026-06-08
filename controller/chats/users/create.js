import { matchedData } from "express-validator";
import { postMessageToUser } from "../../../models/message.js";
import { messageValidations } from "../../validations/message.js";
import { validateRequest } from "../../validations/validate.js";
import { AppError } from "../../../helper/AppErr.js";

export const postMsgToUser = [
  messageValidations,
  validateRequest,
  async (req, res, next) => {
    const userId = Number(req.user.id);
    const targetUserId = Number(req.params.toUserId);

    if (userId === targetUserId) {
      throw new AppError("Invalid request", 400);
    }

    try {
      const { message } = matchedData(req);
      const newMsgToUser = await postMessageToUser(
        userId,
        targetUserId,
        message,
      );
      return res.status(201).json({
        success: true,
        data: newMsgToUser,
      });
    } catch (error) {
      console.error("post msg to user", error);
      next(error);
    }
  },
];
