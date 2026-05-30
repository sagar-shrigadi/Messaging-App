import request from "supertest";
import { app } from "../express.js";
import { auth } from "../../../Router/auth/auth.js";
import * as prisma from "../prisma.js";
import { errHandler } from "../../../controller/errHandler.js";

app.use("/", auth);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());

async function createAndLogUser(username) {
  await prisma.createUser(username);
  const res = await request(app).post("/login").send({
    username,
    password: "123456",
  });
  //   console.log("helper", res.body);
  return res.body.data;
}

export { createAndLogUser };
