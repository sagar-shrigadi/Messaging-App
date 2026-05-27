import { deleteMessageById, getMessageById } from "../../../models/message.js";

export const deleteMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const messageId = Number(req.params.messageId);

  try {
    const msgToDelete = await getMessageById(messageId);

    if (msgToDelete.authorId === userId) {
      await deleteMessageById(messageId);
      return res.status(204).end();
    } else {
      return res.status(403).end();
    }
  } catch (error) {
    console.error("delete msg", error);
    next(error);
  }
};
