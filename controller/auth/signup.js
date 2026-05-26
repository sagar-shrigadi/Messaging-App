import * as argon2 from "argon2";
import { postUser } from "../../models/user.js";

export const signup = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const hashedPass = await argon2.hash(password);

    const newUser = await postUser(username, hashedPass);

    return res.json({ newUser });
  } catch (error) {
    console.log("sign up error", error);
    next(error);
  }
};
