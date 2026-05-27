import { deleteMessageById, getMessageById } from "../../../models/message.js";

export const deleteGlobalMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const msgId = Number(req.params.messageId);

  try {
    const MsgToDelete = await getMessageById(msgId);

    if (MsgToDelete.authorId === userId) {
      const updatedMsg = await deleteMessageById(msgId);
      return res.status(204).json({ msg: "successfully deleted" });
    } else {
      return res.status(403).end();
    }
  } catch (error) {
    console.error("update msg", error);
    next(error);
  }
};
