import "dotenv/config";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { getUserAuth } from "../../models/user.js";
import { body, matchedData, validationResult } from "express-validator";

const emptyErr = `must not be empty!`;
const loginValidations = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${emptyErr}`)
    .isLength({ min: 3, max: 20 })
    .withMessage(`Username must be within 3 and 20 characters!`),

  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyErr}`)
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters!"),
];

export const login = [
  loginValidations,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      // return next(error);
      return res.status(400).json({ error });
    }
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
