import { editMessageById, getMessageById } from "../../../models/message.js";

export const updateGlobalMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const msgId = Number(req.params.messageId);

  try {
    const { message } = req.body;
    const MsgToUpdate = await getMessageById(msgId);

    if (MsgToUpdate.authorId === userId) {
      const updatedMsg = await editMessageById(msgId, message);
      return res.json({ updatedMsg });
    } else {
      return res.status(403).end();
    }
  } catch (error) {
    console.error("update msg", error);
    next(error);
  }
};
