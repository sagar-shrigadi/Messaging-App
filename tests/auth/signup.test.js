import request from "supertest";
import { auth } from "../../Router/auth/auth.js";
import { app } from "../setup/express.js";
import { prismaDisconnect, clearDb, createUser } from "../setup/prisma.js";

app.use("/", auth);

afterAll(async () => await prismaDisconnect());
afterEach(async () => await clearDb());

describe("Successful sign up", () => {
  it("Creates a new user in db", async () => {
    const res = await request(app).post("/signup").send({
      username: "signup",
      password: "123456",
      confirmPassword: "123456",
    });
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toEqual(201);
    expect(res.body).toEqual({ success: true, data: { username: "signup" } });
  });
});

describe("Failed Sign up", () => {
  const errMsg = "responds with status 400";
  describe("Username Validation errors", () => {
    beforeEach(async () => await createUser("signup"));

    it(`${errMsg} when username already exists`, async () => {
      const res = await request(app).post("/signup").send({
        username: "signup",
        password: "345567",
        confirmPassword: "345567",
      });
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        success: false,
        message: "Validation Failed!",
        errors: [{ field: "username", message: "Username already in use!" }],
      });
    });

    describe(`${errMsg} when username is not within the character bounds`, () => {
      it("errors when username is empty", async () => {
        const res = await request(app).post("/signup").send({
          username: "",
          password: "345567",
          confirmPassword: "345567",
        });
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
      it("errors when username is shorter than 3 characters", async () => {
        const res = await request(app).post("/signup").send({
          username: "te",
          password: "345567",
          confirmPassword: "345567",
        });
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          message: "Validation Failed!",
          errors: [
            {
              field: "username",
              message: "Username must be within 3 and 20 characters!",
            },
          ],
        });
      });
      it("errors when username is longer than 20 characters", async () => {
        const res = await request(app).post("/signup").send({
          username: "qwertyuiopasdfghjklzx", // 21 characters
          password: "345567",
          confirmPassword: "345567",
        });
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          message: "Validation Failed!",
          errors: [
            {
              field: "username",
              message: "Username must be within 3 and 20 characters!",
            },
          ],
        });
      });
    });
  });

  describe("Password Validation errors", () => {
    describe(`${errMsg} when password it not within the character bounds`, () => {
      it("errors when password is empty", async () => {
        const res = await request(app).post("/signup").send({
          username: "same",
          password: "",
          confirmPassword: "",
        });
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
      it("errors when password is shorter than 6 characters", async () => {
        const res = await request(app).post("/signup").send({
          username: "same",
          password: "3457",
          confirmPassword: "3457",
        });
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          message: "Validation Failed!",
          errors: [
            {
              field: "password",
              message: "Password must be within 6 and 30 characters!",
            },
          ],
        });
      });
      it("errors when password is longer than 30 characters", async () => {
        const res = await request(app).post("/signup").send({
          username: "same",
          password: "qwerty123456uio987MsBa@-Hgc#1s0", // 31 characters
          confirmPassword: "qwerty123456uio987MsBa@-Hgc#1s0",
        });
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.status).toEqual(400);
        expect(res.body).toEqual({
          success: false,
          message: "Validation Failed!",
          errors: [
            {
              field: "password",
              message: "Password must be within 6 and 30 characters!",
            },
          ],
        });
      });
    });
    it(`${errMsg} when password and confirm password fields do not match`, async () => {
      const res = await request(app).post("/signup").send({
        username: "same",
        password: "234456",
        confirmPassword: "sdfknwer",
      });
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toEqual(400);
      expect(res.body).toEqual({
        success: false,
        message: "Validation Failed!",
        errors: [
          {
            field: "confirmPassword",
            message: "Password do not match!",
          },
        ],
      });
    });
  });
});
