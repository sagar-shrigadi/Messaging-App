import { Router } from "express";

export const api = Router();

api.get("/", (req, res) => res.send("index route"));
