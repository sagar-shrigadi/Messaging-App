import { Router } from "express";
import { profile } from "../../controller/profile.js";

export const me = Router();

me.get("/me", profile);
