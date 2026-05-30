import request from "supertest";
import { app } from "../../setup/express.js";
import { chat } from "../../../Router/chat/chat.js";
import * as prisma from "../../setup/prisma.js";
import { errHandler } from "../../../controller/errHandler.js";
import { createAndLogUser } from "../../setup/helper/createAndLogUser.js";

app.use("/", chat);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("Post global message", () => {
  it("errors when no token is provided", async () => {
    const res = await request(app)
      .post("/global")
      .send({ message: "some msg" });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Token Missing");
  });

  it("responds with json", async () => {
    // a user is created and logged in
    // which returns a jwt token
    const token = await createAndLogUser("Create");
    // console.log("in test", token);

    // because its a protected route, a valid token needs to be sent for authentication
    // set the token using `Authorization` header as `Bearer` token
    // send the POST request
    const res = await request(app)
      .post("/global")
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Hola!" });
    expect(res.headers["content-type"]).toMatch(/json/);
    // console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Hola!");
  });
});
