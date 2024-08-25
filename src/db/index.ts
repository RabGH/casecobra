import { PrismaClient } from "@prisma/client";
// Write it once, connect to the database 1 time and cache the data
// Prevents too many clients, index to the db
// We can always invoke a new prisma client, but better that 1 client is running
declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }

  prisma = global.cachedPrisma;
}

export const db = prisma;
