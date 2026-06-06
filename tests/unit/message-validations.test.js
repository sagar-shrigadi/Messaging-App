import request from "supertest";
import { app } from "../setup/express.js";
import * as prisma from "../setup/prisma.js";
import { authenticateToken } from "../../controller/auth/authenticateToken.js";
import { messageValidations } from "../../controller/validations/message.js";
import { validateRequest } from "../../controller/validations/validate.js";
import { errHandler } from "../../controller/errHandler.js";
import { matchedData } from "express-validator";
import { postGlobalMessage } from "../../models/message.js";
import { createAndLogUser } from "../setup/helper/createAndLogUser.js";

afterAll(async () => await prisma.prismaDisconnect());
afterEach(async () => await prisma.clearDb());
app.use(authenticateToken);
app.use("/", [
  messageValidations,
  validateRequest,
  async (req, res, next) => {
    try {
      const userId = Number(req.user.id);
      const { message } = matchedData(req);
      const msg = await postGlobalMessage(userId, message);
      return res.status(201).json({
        success: true,
        data: msg,
      });
    } catch (error) {
      next(error);
    }
  },
]);
app.use(errHandler);

describe("Message validations", () => {
  describe("Failed validations", () => {
    it("errors when message is longer than 100 characters", async () => {
      const token = await createAndLogUser("validation");
      const res = await request(app)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          message: `Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit. 
          Vivamus porttitor risus magna, 
          vulputate vehicula justo ullamcorper vitae. 
          Maecenas sed erat vel erat iaculis sodales. 
          Sed tortor orci, tempor in laoreet non, laoreet at mi. 
          Donec facilisis eleifend elit a pellentesque. Proin dui tortor, 
          vehicula id vehicula vitae, laoreet eget neque. In elementum tellus metus, 
          ut vehicula odio ornare ac. Etiam feugiat purus sit amet nibh ultrices congue. 
          Duis tincidunt massa nec ex tempus semper. Proin viverra urna nunc, 
          non porta erat ullamcorper in. Vestibulum ipsum nisi, sagittis sed risus nec, 
          euismod maximus eros. Fusce tempor ipsum vitae semper iaculis.`,
        });
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: "Validation Failed!",
        errors: [
          {
            field: "message",
            message: "Message must have less than 100 character!",
          },
        ],
      });
    });
  });
  describe("Successful post message", () => {
    it("responds with json with http status 201", async () => {
      const token = await createAndLogUser("validate");
      const res = await request(app)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Some message to test successful validations!" });
      expect(res.headers["content-type"]).toMatch(/json/);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe(
        "Some message to test successful validations!",
      );
    });
  });
});
