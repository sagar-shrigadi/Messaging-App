import "dotenv/config";
import express from "express";
import { api } from "./Router/api.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`running on port ${PORT}`);
});
