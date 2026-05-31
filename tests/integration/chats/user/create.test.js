import request from "supertest";
import { app } from "../../../setup/express.js";
import { chat } from "../../../../Router/chat/chat.js";
import * as prisma from "../../../setup/prisma.js";
import { errHandler } from "../../../../controller/errHandler.js";
import { loginAndReturnUser } from "../../../setup/helper/loginAndReturnUser.js";

app.use("/", chat);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

// creates two users and send a message from user 1 to user 2
describe("Post User message", () => {
  it("responds with json", async () => {
    // login users and returns on object containing user id and jwt token
    const { user1, user2 } = await loginAndReturnUser();

    const res = await request(app)
      .post(`/users/${user2.id}`) // send post request to user 2
      .set("Authorization", `Bearer ${user1.token}`) // from user 1
      .send({ message: "hey!" });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(201);
    //   console.log(res.body.data);
    expect(res.body.success).toBe(true);
    expect(res.body.data.authorId).toEqual(user1.id);
    expect(res.body.data.toUserId).toEqual(user2.id);
  });
});
