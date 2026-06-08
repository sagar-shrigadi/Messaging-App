import { AppError } from "../../helper/AppErr.js";
import { verifyToken } from "../../helper/verifyToken.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) {
      throw new AppError("Token Missing", 401);
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
