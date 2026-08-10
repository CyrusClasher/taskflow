import { PrismaClient } from '@prisma/client';

// A single shared Prisma client instance is reused across the app instead of
// creating a new connection pool on every request/import.
const prisma = new PrismaClient();

export default prisma;
