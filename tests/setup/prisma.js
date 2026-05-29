import { prisma } from "../../lib/prisma.js";
import * as argon2 from "argon2";

const prismaDisconnect = async () => await prisma.$disconnect();

const clearDb = async () =>
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.message.deleteMany(),
  ]);

const createUser = async (username) => {
  const hashedPass = await argon2.hash("123456");
  return await prisma.user.create({
    data: { username, password: hashedPass },
  });
};

export { prismaDisconnect, clearDb, createUser };
