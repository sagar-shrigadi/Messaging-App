import { editMessageById, getMessageById } from "../../../models/message.js";

export const updateUserMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const targetUserId = Number(req.params.toUserId);
  const messageId = Number(req.params.messageId);

  try {
    const { message } = req.body;
    const msgToUpdate = await getMessageById(messageId);

    if (msgToUpdate.authorId === userId) {
      const updatedMsg = await editMessageById(messageId, message);
      return res.json({ updatedMsg });
    } else {
      return res.status(403).end();
    }
  } catch (error) {
    console.error("update user error", error);
    next(error);
  }
};
