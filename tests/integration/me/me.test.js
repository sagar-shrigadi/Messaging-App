import request from "supertest";
import { app } from "../../setup/express.js";
import { me } from "../../../Router/me/me.js";
import * as prisma from "../../setup/prisma.js";
import { authenticateToken } from "../../../controller/auth/authenticateToken.js";
import { errHandler } from "../../../controller/errHandler.js";
import { createAndLogUser } from "../../setup/helper/createAndLogUser.js";

app.use(authenticateToken);
app.use("/", me);
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("'users/Me' route", () => {
  it("responds with json containing user info", async () => {
    const token = await createAndLogUser("userInfo");
    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe("userInfo");
  });
});
