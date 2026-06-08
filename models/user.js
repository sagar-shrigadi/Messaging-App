import { prisma } from "../lib/prisma.js";

export const getUserAuth = (username) => {
  return prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, password: true },
  });
};
export const getUser = (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};
export const getAllUsers = () => {
  return prisma.user.findMany({ select: { id: true, username: true } });
};
export const postUser = (username, password) => {
  return prisma.user.create({
    data: {
      username,
      password,
    },
    select: { username: true },
  });
};
export const updateUserBio = (userId, bio) => {
  return prisma.user.update({ where: { id: userId }, data: { bio } });
};
