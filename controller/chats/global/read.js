import { getAllGlobalMessage } from "../../../models/message.js";

export const getGlobalMsgs = async (req, res, next) => {
  try {
    const allMsgs = await getAllGlobalMessage();
    return res.json({ allMsgs });
  } catch (error) {
    console.error("get all global msg", error);
    next(error);
  }
};
