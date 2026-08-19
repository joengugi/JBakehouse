import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prismaclient } from "../lib/generated/prisma/client";
;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new Prismaclient({
  adapter,
});

async function main() {
  const email = "joengugi361@gmail.com";
  const password = "@test01";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: "Joseph Admin",
      passwordHash,
      role: "ADMIN",
      active: true,
    },
    create: {
      name: "Joseph Admin",
      email,
      passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Admin user created/updated:");
  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
  });
}

main()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });