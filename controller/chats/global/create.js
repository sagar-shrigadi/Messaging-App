import { postGlobalMessage } from "../../../models/message.js";

export const postGlobalMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const { message } = req.body;

  try {
    const newGlobalMessage = await postGlobalMessage(userId, message);
    return res.status(201).json({ newMessage: newGlobalMessage });
  } catch (error) {
    console.error("create global message", error);
    next(error);
  }
};
