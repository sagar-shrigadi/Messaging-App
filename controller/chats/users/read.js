import { AppError } from "../../../helper/AppErr.js";
import { getMessagesBetweenUsers } from "../../../models/message.js";

export const getMsgBetweenUsers = async (req, res, next) => {
  const userId = Number(req.user.id);
  const targetUserId = Number(req.params.toUserId);

  if (userId === targetUserId) {
    throw new AppError("Invalid request", 400);
  }
  try {
    const chatMsg = await getMessagesBetweenUsers(userId, targetUserId);

    return res.status(200).json({
      success: true,
      data: chatMsg,
    });
  } catch (error) {
    console.error("get message betn user", error);
    next(error);
  }
};
