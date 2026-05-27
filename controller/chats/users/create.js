import { postMessageToUser } from "../../../models/message.js";

export const postMsgToUser = async (req, res, next) => {
  const userId = Number(req.user.id);
  const targetUserId = Number(req.params.toUserId);
  console.log("target user id", targetUserId);

  if (userId === targetUserId) {
    return res.status(400).json({ msg: "Invalid request!" });
  }

  try {
    const { message } = req.body;
    const newMsgToUser = await postMessageToUser(userId, targetUserId, message);
    return res.status(201).json({ newMsgToUser });
  } catch (error) {
    console.error("post msg to user", error);
    next(error);
  }
};
