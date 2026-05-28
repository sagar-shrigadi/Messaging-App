import { body } from "express-validator";

export const emptyErr = `must not be empty!`;
export const signUpValidations = [
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
