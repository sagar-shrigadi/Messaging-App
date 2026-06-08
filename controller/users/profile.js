import { getUser, updateUserBio } from "../../models/user.js";

export const getUserProfile = async (req, res, next) => {
  try {
    // req.user was populated in authenticateToken middlware
    // if valid token was provided
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

export const patchUserBio = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { bio } = req.body;

    const user = await updateUserBio(userId, bio);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
