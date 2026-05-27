import { getAllGlobalMessage } from "../../../models/message.js";

export const readGlobalMsg = async (req, res, next) => {
  try {
    const allGlobalMsg = await getAllGlobalMessage();
    return res.json({ allGlobalMsg });
  } catch (error) {
    console.error("get global msg", error);
    next(error);
  }
};
