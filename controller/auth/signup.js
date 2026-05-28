import * as argon2 from "argon2";
import { getUserAuth, postUser } from "../../models/user.js";
import { matchedData } from "express-validator";
import { signUpValidations } from "../validations/signup.js";
import { validateRequest } from "../validations/validate.js";

export const signup = [
  signUpValidations,
  validateRequest,
  async (req, res, next) => {
    const { username, password, confirmPassword } = matchedData(req);

    try {
      const hashedPass = await argon2.hash(password);

      const newUser = await postUser(username, hashedPass);

      return res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.log("sign up error", error);
      return next(error);
    }
  },
];
