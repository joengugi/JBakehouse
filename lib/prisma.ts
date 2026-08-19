// src/lib/prisma.ts

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import  {Prismaclient}  from "./generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: Prismaclient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new Prismaclient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}