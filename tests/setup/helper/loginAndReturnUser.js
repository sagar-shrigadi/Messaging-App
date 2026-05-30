import { createAndLogUser } from "./createAndLogUser.js";
import jwt from "jsonwebtoken";

async function loginAndReturnUser() {
  const user1_token = await createAndLogUser("user1");
  const user1Decoded = jwt.verify(user1_token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });

  const user2_token = await createAndLogUser("user2");
  const user2Decoded = jwt.verify(user2_token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });

  return {
    user1: {
      id: user1Decoded.id,
      token: user1_token,
    },
    user2: {
      id: user2Decoded.id,
      token: user2_token,
    },
  };
}
export { loginAndReturnUser };
