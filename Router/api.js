import { Router } from "express";
import { auth } from "./auth/auth.js";
import { authenticateToken } from "../controller/auth/authenticateToken.js";
import { chat } from "./chat/chat.js";
import { messages } from "./messages/messages.js";
import { me } from "./me/me.js";

export const api = Router();

// auth routes (login/signup)
api.use("/auth", auth);

// chat router (both global and user chats)
api.use("/chats", chat);

// token authenticator
// to secure routes below
// i.e only allow access if a valid token is provided
api.use(authenticateToken);

// message router
api.use("/messages", messages);

// user info route
api.use("/users", me);
