import { Router } from "express";
import { profile } from "../../controller/users/profile.js";
import { authenticateToken } from "../../controller/auth/authenticateToken.js";
import { readAll } from "../../controller/users/readAll.js";

export const users = Router();

users.get("/", readAll);

users.use(authenticateToken);
users.get("/me", profile);
