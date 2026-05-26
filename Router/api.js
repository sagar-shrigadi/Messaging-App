import { Router } from "express";
import { auth } from "./auth/auth.js";
import { authenticateToken } from "../controller/auth/authenticateToken.js";
import { profile } from "../controller/profile.js";

export const api = Router();

api.use("/auth/user", auth);
api.use(authenticateToken);
api.get("/user/profile", profile);
api.get("/", (req, res) => res.send("index route"));
