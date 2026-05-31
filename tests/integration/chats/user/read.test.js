import request from "supertest";
import { app } from "../../../setup/express.js";
import { chat } from "../../../../Router/chat/chat.js";
import * as prisma from "../../../setup/prisma.js";
import { errHandler } from "../../../../controller/errHandler.js";
import { loginAndReturnUser } from "../../../setup/helper/loginAndReturnUser.js";
import { postMessageToUser } from "../../../../models/message.js";

app.use("/", chat);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("Get Messages between users", () => {
  it("Responds with json", async () => {
    const { user1, user2 } = await loginAndReturnUser();

    // seed data
    await postMessageToUser(user1.id, user2.id, "Hey!");
    await postMessageToUser(user2.id, user1.id, "hey, there! how's it going?");

    const resG = await request(app)
      .get(`/users/${user2.id}`)
      .set("Authorization", `Bearer ${user1.token}`);
    expect(resG.headers["content-type"]).toMatch(/json/);
    expect(resG.status).toBe(200);
    const arr = resG.body.data;
    expect(arr.length).toBe(2);
    expect(resG.body.data[0].content).toBe("Hey!");
    expect(resG.body.data[0].authorId).toEqual(user1.id);
    expect(resG.body.data[0].toUserId).toEqual(user2.id);
    expect(resG.body.data[1].content).toBe("hey, there! how's it going?");
    expect(resG.body.data[1].authorId).toEqual(user2.id);
    expect(resG.body.data[1].toUserId).toEqual(user1.id);
  });
});
