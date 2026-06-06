import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { api } from "./Router/api.js";
import { errHandler } from "./controller/errHandler.js";

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.use(errHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`running on port ${PORT}`);
});
