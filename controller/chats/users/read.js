import { getMessagesBetweenUsers } from "../../../models/message.js";

export const getMsgBetweenUsers = async (req, res, next) => {
  const userId = Number(req.user.id);
  const targetUserId = Number(req.params.toUserId);

  if (userId === targetUserId) {
    return res.status(400).json({ msg: "Invalid request!" });
  }

  try {
    const chatMsg = await getMessagesBetweenUsers(userId, targetUserId);
    console.log(`betn user ${userId} and to user ${targetUserId}`, chatMsg);

    return res.status(200).json({
      success: true,
      data: chatMsg,
    });
  } catch (error) {
    console.error("get message betn user", error);
    next(error);
  }
};
