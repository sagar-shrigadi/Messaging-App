import { prisma } from "../lib/prisma.js";

export const postGlobalMessage = (userId, message) => {
  return prisma.message.create({
    data: { content: message, author: { connect: { id: userId } } },
    include: { author: { select: { username: true } } },
  });
};
export const getAllGlobalMessage = () => {
  return prisma.message.findMany({
    where: { toUserId: null },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: "asc" },
  });
};
export const getMessageById = (messageId) => {
  return prisma.message.findUnique({
    where: { id: messageId },
    include: { author: { select: { username: true } } },
  });
};
export const editMessageById = (messageId, message) => {
  return prisma.message.update({
    where: { id: messageId },
    data: { content: message },
    include: { author: { select: { username: true } } },
  });
};
export const deleteMessageById = (messageId) => {
  return prisma.message.delete({
    where: { id: messageId },
  });
};
export const getMessagesBetweenUsers = (userId, targetUserId) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { authorId: userId, toUserId: targetUserId },
        { authorId: targetUserId, toUserId: userId },
      ],
    },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: "asc" },
  });
};
export const postMessageToUser = (userId, targetUserId, message) => {
  return prisma.message.create({
    data: {
      content: message,
      toUser: { connect: { id: targetUserId } },
      author: { connect: { id: userId } },
    },
    include: { author: { select: { username: true } } },
  });
};
