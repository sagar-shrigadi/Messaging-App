import { body } from "express-validator";
import { emptyErr } from "./signup.js";

export const messageValidations = [
  body("message")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Message must have less than 100 character!"),
];
