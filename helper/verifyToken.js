import jwt from "jsonwebtoken";
import { AppError } from "./AppErr.js";

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token has expired, Please Log In!", 401);
    } else if (error.name === "JsonWebTokenError") {
      throw new AppError("Deformed Token", 401);
    } else {
      throw error;
    }
  }
};
