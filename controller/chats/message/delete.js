import { AppError } from "../../../helper/AppErr.js";
import { deleteMessageById, getMessageById } from "../../../models/message.js";

export const deleteMsg = async (req, res, next) => {
  const userId = Number(req.user.id);
  const messageId = Number(req.params.messageId);

  try {
    const msgToDelete = await getMessageById(messageId);

    if (!msgToDelete) throw new AppError("Message does not exist!", 404);

    if (msgToDelete.authorId === userId) {
      await deleteMessageById(messageId);
      return res.status(204).end();
    } else {
      return new AppError("You are not permitted to perform this action", 403);
    }
  } catch (error) {
    console.error("delete msg", error);
    next(error);
  }
};
