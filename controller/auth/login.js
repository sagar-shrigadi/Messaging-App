import "dotenv/config";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { getUserAuth } from "../../models/user.js";
import { matchedData } from "express-validator";
import { loginValidations } from "../validations/login.js";
import { validateRequest } from "../validations/validate.js";

export const login = [
  loginValidations,
  validateRequest,
  async (req, res, next) => {
    const { username, password } = matchedData(req);

    try {
      const user = await getUserAuth(username);

      const passMatch = await argon2.verify(
        user?.password ?? process.env.FALLBACK_HASH,
        password,
      );
      console.log("pass match", passMatch);

      if (user && passMatch) {
        const token = jwt.sign(
          {
            id: user?.id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" },
        );
        return res.json({ token });
      } else {
        const error = new Error("Invalid Credentials!");
        return next(error);
      }
    } catch (error) {
      console.error("login error", error);
      return next(error);
    }
  },
];
