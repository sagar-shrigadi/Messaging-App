import request from "supertest";
import { app } from "../../../setup/express.js";
import { messages } from "../../../../Router/messages/messages.js";
import * as prisma from "../../../setup/prisma.js";
import { errHandler } from "../../../../controller/errHandler.js";
import { authenticateToken } from "../../../../controller/auth/authenticateToken.js";
import {
  createAndLogUser,
  createUserWithGlobalMsgAndLogUser,
} from "../../../setup/helper/createAndLogUser.js";
import { loginAndReturnUser } from "../../../setup/helper/loginAndReturnUser.js";
import {
  postGlobalMessage,
  postMessageToUser,
} from "../../../../models/message.js";

app.use(authenticateToken);
app.use("/", messages);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("send and delete global message", () => {
  it("responds with 204", async () => {
    const { token, msg } = await createUserWithGlobalMsgAndLogUser("delete");
    const res = await request(app)
      .delete(`/${msg[0].id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

describe("send and delete a message sent to another user", () => {
  it("responds with 204", async () => {
    const { user1, user2 } = await loginAndReturnUser();

    // seed data
    const msg = await postMessageToUser(user1.id, user2.id, "bellow~");
    await postMessageToUser(user2.id, user1.id, "Hey!");

    const res = await request(app)
      .delete(`/${msg.id}`)
      .set("Authorization", `Bearer ${user1.token}`);
    expect(res.status).toBe(204);
  });
});

describe("Failed to delete", () => {
  it("responds with status 404 when message doesnt exist", async () => {
    const token = await createAndLogUser("delete");
    const res = await request(app)
      .delete(`/${879}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Message does not exist!");
  });

  it("responds with status 403 when message to delete doesnt belong to user", async () => {
    const { user1, user2 } = await loginAndReturnUser();

    // seed data
    const msg = await postGlobalMessage(
      user1.id,
      "user2 will try to delete this message",
    );

    const res = await request(app)
      .delete(`/${msg.id}`)
      .set("Authorization", `Bearer ${user2.token}`);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "You are not permitted to perform this action",
    );
  });
});
