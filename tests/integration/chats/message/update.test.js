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

// beacause messages is a protected route, authenticateToken middleware needs to be present here as well
// in order to decode the req attached jwt token
// and populate req.user with decoded payload
app.use(authenticateToken);
app.use("/", messages);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("Send and update a global message", () => {
  it("responds with json", async () => {
    const { token, msg } = await createUserWithGlobalMsgAndLogUser("patch");

    const res = await request(app)
      .patch(`/${msg[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "'Nested' becomes 'Nested (updated)'" });

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toEqual(
      "'Nested' becomes 'Nested (updated)'",
    );
  });
});

describe("Send and update a message sent to another user", () => {
  it("responds with json", async () => {
    const { user1, user2 } = await loginAndReturnUser();

    // seed data
    await postMessageToUser(user1.id, user2.id, "Hola!");
    const msg = await postMessageToUser(user2.id, user1.id, "How's it gonig!");

    const res = await request(app)
      .patch(`/${msg.id}`)
      .set("Authorization", `Bearer ${user2.token}`)
      .send({ message: "How's it going!" });

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toEqual("How's it going!");
  });
});

describe("Failed to update", () => {
  it("responds with status 404 when message to update doesnt exist", async () => {
    const token = await createAndLogUser("patch");
    const res = await request(app)
      .patch(`/${56}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "some stuff" });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Message does not exist!");
  });

  it("responds with status 403 when message to update doesnt belong to user", async () => {
    const { user1, user2 } = await loginAndReturnUser();

    // seed data
    const msg = await postGlobalMessage(
      user1.id,
      "user2 will try to update this msg",
    );

    const res = await request(app)
      .patch(`/${msg.id}`)
      .set("Authorization", `Bearer ${user2.token}`)
      .send({ message: "some updated message!" });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "You are not permitted to perform this action",
    );
  });
});
