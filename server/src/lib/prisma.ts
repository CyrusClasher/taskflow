// import { PrismaClient } from '@prisma/client';

// // A single shared Prisma client instance is reused across the app instead of
// // creating a new connection pool on every request/import.
// const prisma = new PrismaClient();

// export default prisma;
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
