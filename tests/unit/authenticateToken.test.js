import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../setup/express.js";
import * as prisma from "../setup/prisma.js";
import { authenticateToken } from "../../controller/auth/authenticateToken.js";
import { errHandler } from "../../controller/errHandler.js";
import { createAndLogUser } from "../setup/helper/createAndLogUser.js";

app.use(authenticateToken);
app.use("/", (req, res, next) => res.status(200).json({ success: true }));
app.use(errHandler);

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());

describe("Authenticate Token", () => {
  describe("Failed Authentications", () => {
    it("responds with 401 when no token is provided", async () => {
      const res = await request(app).get("/");
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Token Missing");
    });
    it("responds with 401 when token is expired", async () => {
      const token = await createAndLogUser("auth");
      //   console.log("token", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      //   console.log("token decoded", decoded);
      //   token decoded { id: <num>, iat: 1780216146, exp: 1780302546 }
      const newExpiredToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQzMywiaWF0IjoxNzgwMjE1OTg5LCJleHAiOjE2NDAzMDYxNDZ9._kZ4L5-W9KwVfdoTHlWWtgUn8In214KZZgch4IHh0cQ`;
      const res = await request(app)
        .get("/")
        .set("Authorization", `Bearer ${newExpiredToken}`);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Token has expired, Please Log In!");
    });
    it("responds with 401 when token is deformed", async () => {
      const token = await createAndLogUser("auth");
      const res = await request(app)
        .get("/")
        .set("Authorization", `Bearer g${token}`);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Deformed Token");
    });
  });
  describe("Successful Authentication", () => {
    it("responds with json with http status 200", async () => {
      const token = await createAndLogUser("auth");
      const res = await request(app)
        .get("/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
      });
    });
  });
});
