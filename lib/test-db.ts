import { prisma } from "@/lib/prisma";

async function testDatabase() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  });

  console.log(users);
}

testDatabase()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });