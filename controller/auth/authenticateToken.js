import "dotenv/config";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("Token Missing");
    return next(error);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = decoded;
    next();
  } catch (error) {
    const err = new Error();

    if (error.name === "TokenExpiredError") {
      err.message = "Token has expired";
      err.status = 401;
    } else if (error.name === "JsonWebTokenError") {
      err.message = "Invalid token structure";
      err.status = 401;
    } else {
      err.message = "Authentication failed";
      err.status = 401;
    }

    next(err);
  }
};
