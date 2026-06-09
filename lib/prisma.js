import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString =
  process.env.NODE_ENV === "test"
    ? `${process.env.TEST_DATABASE_URL}`
    : `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({
  adapter,
  omit: { user: { password: true } },
});
