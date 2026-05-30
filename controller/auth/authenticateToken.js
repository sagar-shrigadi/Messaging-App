import "dotenv/config";
import jwt from "jsonwebtoken";
import { AppError } from "../../helper/AppErr.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) {
      throw new AppError("Token Missing", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(new AppError("Token has expired, Please Log In!", 401));
    } else if (error.name === "JsonWebTokenError") {
      next(new AppError("Deformed Token", 401));
    }
    next(error);
  }
};
