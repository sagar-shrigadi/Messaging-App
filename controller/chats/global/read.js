import { getAllGlobalMessage } from "../../../models/message.js";

export const getGlobalMsgs = async (req, res, next) => {
  try {
    const allMsgs = await getAllGlobalMessage();
    return res.status(200).json({
      success: true,
      data: allMsgs,
    });
  } catch (error) {
    console.error("get all global msg", error);
    next(error);
  }
};
