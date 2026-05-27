import { getMessagesBetweenUsers } from "../../../models/message.js";

export const getMsgBetweenUsers = async (req, res, next) => {
  const userId = Number(req.user.id);
  const targetUserId = Number(req.params.toUserId);

  try {
    const chatMsg = await getMessagesBetweenUsers(userId, targetUserId);
    console.log(`betn user ${userId} and to user ${targetUserId}`, chatMsg);

    return res.json({ chatMsg });
  } catch (error) {
    console.error("get message betn user", error);
    next(error);
  }
};
