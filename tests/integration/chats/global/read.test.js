import request from "supertest";
import { app } from "../../../setup/express.js";
import { chat } from "../../../../Router/chat/chat.js";
import { errHandler } from "../../../../controller/errHandler.js";
import * as prisma from "../../../setup/prisma.js";

app.use("/", chat);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

test("get all global message", async () => {
  await prisma.createUserWithGlobalMessages("Read");
  const res = await request(app).get("/global");
  expect(res.headers["content-type"]).toMatch(/json/);
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  //   console.log("Read global", res.body);
  const arr = res.body.data;
  expect(arr.length).toBe(2);
});
