import { deleteMessageById, getMessageById } from "../../../models/message.js";

export const deleteUserMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const targetUserId = Number(req.params.toUserId);
  const messageId = Number(req.params.messageId);

  try {
    const msgToUpdate = await getMessageById(messageId);

    if (msgToUpdate.authorId === userId) {
      const updatedMsg = await deleteMessageById(messageId);
      return res.status(204).json({ msg: "successfully deleted!" });
    } else {
      return res.status(403).end();
    }
  } catch (error) {
    console.error("update user error", error);
    next(error);
  }
};
