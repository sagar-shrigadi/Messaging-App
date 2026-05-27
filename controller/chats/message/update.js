import { editMessageById, getMessageById } from "../../../models/message.js";

export const updateMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const messageId = Number(req.params.messageId);
  const { message } = req.body;

  try {
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
};
