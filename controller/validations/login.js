import { body } from "express-validator";
import { emptyErr } from "./signup.js";

export const loginValidations = [
  body("username").trim().notEmpty().withMessage(`Username ${emptyErr}`),

  body("password").trim().notEmpty().withMessage(`Password ${emptyErr}`),
];
