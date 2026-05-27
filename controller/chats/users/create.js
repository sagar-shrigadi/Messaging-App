import { body, matchedData, validationResult } from "express-validator";
import { postMessageToUser } from "../../../models/message.js";
import { msgValidations } from "../global/create.js";

export const postMsgToUser = [
  msgValidations,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array();
      return res.status(400).json({ error });
    }

    const userId = Number(req.user.id);
    const targetUserId = Number(req.params.toUserId);
    // console.log("target user id", targetUserId);

    if (userId === targetUserId) {
      return res.status(400).json({ msg: "Invalid request!" });
    }

    try {
      const { message } = matchedData(req);
      const newMsgToUser = await postMessageToUser(
        userId,
        targetUserId,
        message,
      );
      return res.status(201).json({ newMsgToUser });
    } catch (error) {
      console.error("post msg to user", error);
      next(error);
    }
  },
];
