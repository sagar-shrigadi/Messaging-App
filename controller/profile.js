import { getUser } from "../models/user.js";

export const profile = async (req, res, next) => {
  try {
    // req.user was populated in authenticateToken middlware
    // if valid token was provided
    console.log("req.user", req.user);

    const userId = Number(req.user.id);
    const user = await getUser(userId);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
