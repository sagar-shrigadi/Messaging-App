import { body, matchedData, validationResult } from "express-validator";
import { postGlobalMessage } from "../../../models/message.js";

export const msgValidations = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message must not be empty!")
    .isLength({ max: 2000 })
    .withMessage("Message must be under 2000 character!"),
];
export const postGlobalMsg = [
  msgValidations,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      return res.status(400).json({ error });
    }
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
