import { body } from "express-validator";
import { emptyErr } from "./signup.js";

export const messageValidations = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage(`Message ${emptyErr}`)
    .isLength({ max: 2000 })
    .withMessage("Message must be under 2000 character!"),
];
