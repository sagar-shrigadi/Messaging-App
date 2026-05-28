import { body } from "express-validator";
import { emptyErr } from "./signup.js";

export const loginValidations = [
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
