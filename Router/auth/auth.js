import { Router } from "express";
import { login } from "../../controller/auth/login.js";
import { signup } from "../../controller/auth/signup.js";

export const auth = Router();

auth.post("/login", login);
auth.post("/signup", signup);
