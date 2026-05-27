import * as argon2 from "argon2";
import { getUserAuth, postUser } from "../../models/user.js";
import { body, matchedData, validationResult } from "express-validator";

const emptyErr = "must not be empty!";
const signUpValidations = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${emptyErr}`)
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be within 3 and 20 characters!")
    .custom(async (value) => {
      const user = await getUserAuth(value);
      if (user) {
        throw new Error(`Username already in use!`);
      }
    }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyErr}`)
    .isLength({ min: 6, max: 30 })
    .withMessage("Password must be within 6 and 30 characters!"),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password do not match!"),
];

export const signup = [
  signUpValidations,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array();
      // return next(error);
      return res.status(400).json({ error });
    }

    const { username, password, confirmPassword } = matchedData(req);

    try {
      const hashedPass = await argon2.hash(password);

      const newUser = await postUser(username, hashedPass);

      return res.status(201).json({ newUser });
    } catch (error) {
      console.log("sign up error", error);
      return next(error);
    }
  },
];
