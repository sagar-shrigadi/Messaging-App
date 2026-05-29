import request from "supertest";
import { auth } from "../../Router/auth/auth.js";
import { app } from "../setup/express.js";
import { clearDb, createUser, prismaDisconnect } from "../setup/prisma.js";
import { errHandler } from "../../controller/errHandler.js";

app.use("/", auth);
app.use(errHandler);

afterAll(async () => await prismaDisconnect());
afterEach(async () => await clearDb());

describe("Successful Log in", () => {
  beforeEach(async () => await createUser("login"));
  it("responds with json", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "login", password: "123456" });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Failed Log in", () => {
  describe("Invalid Credentials", () => {
    it("User exists but entered incorrect password", async () => {
      await createUser("login");
      const res = await request(app)
        .post("/login")
        .send({ username: "login", password: "asddfgd" });

      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid Credentials!");
    });
    it("User Doesn't exist", async () => {
      const res = await request(app)
        .post("/login")
        .send({ username: "login", password: "12334545" });

      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid Credentials!");
    });
  });
  describe("Validation Errors", () => {
    describe("Username", () => {
      it("errors when username is empty", async () => {
        const res = await request(app)
          .post("/login")
          .send({ username: "", password: "asddfg" });
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          message: "Validation Failed!",
          errors: [
            {
              field: "username",
              message: "Username must not be empty!",
            },
          ],
        });
      });
    });
    describe("Password", () => {
      it("errors when password is empty", async () => {
        const res = await request(app)
          .post("/login")
          .send({ username: "login", password: "" });
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          message: "Validation Failed!",
          errors: [
            {
              field: "password",
              message: "Password must not be empty!",
            },
          ],
        });
      });
    });
  });
});
