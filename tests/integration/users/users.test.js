import request from "supertest";
import { app } from "../../setup/express.js";
import { users } from "../../../Router/users/users.js";
import * as prisma from "../../setup/prisma.js";
import { authenticateToken } from "../../../controller/auth/authenticateToken.js";
import { errHandler } from "../../../controller/errHandler.js";
import { createAndLogUser } from "../../setup/helper/createAndLogUser.js";

app.get("/", users);
app.use(authenticateToken);
app.use("/", users);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("GET '/' route", () => {
  it("responds with json containing all registered users", async () => {
    // seed data
    await prisma.createUser("user1");
    await prisma.createUser("user2");
    await prisma.createUser("user3");

    const res = await request(app).get("/");
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.data[0].username).toBe("user1");
    expect(res.body.data[1].username).toBe("user2");
    expect(res.body.data[2].username).toBe("user3");
  });
});

describe("'/Me' route", () => {
  it("GET, responds with json containing user info", async () => {
    const token = await createAndLogUser("userInfo");
    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe("userInfo");
  });
  it("PATCH, responds with json containing updated user bio", async () => {
    const token = await createAndLogUser("userBio");
    const res = await request(app)
      .patch("/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Some updated bio" });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe("userBio");
    expect(res.body.data.bio).toBe("Some updated bio");
  });
});
