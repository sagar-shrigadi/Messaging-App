import { prisma } from "../../lib/prisma.js";
import * as argon2 from "argon2";

const prismaDisconnect = async () => await prisma.$disconnect();

const clearDb = async () =>
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.user.deleteMany(),
  ]);

const createUser = async (username) => {
  const hashedPass = await argon2.hash("123456");
  return await prisma.user.create({
    data: { username, password: hashedPass },
  });
};
const createUserWithGlobalMessages = async (username) => {
  const hash = await argon2.hash("123456");
  return prisma.user.create({
    data: {
      username,
      password: hash,
      sentMsg: {
        create: [
          {
            content: "Nested",
          },
          {
            content: "More Nested",
          },
        ],
      },
    },
  });
};
export { prismaDisconnect, clearDb, createUser, createUserWithGlobalMessages };
