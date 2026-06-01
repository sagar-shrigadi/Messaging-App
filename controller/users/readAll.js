import { getAllUsers } from "../../models/user.js";

export const readAll = async (req, res, next) => {
  const allUsers = await getAllUsers();
  return res.status(200).json({
    success: true,
    data: allUsers,
  });
};
