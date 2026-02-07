import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
// Set the WebSocket constructor for the Neon configuration if in development
if (process.env.NODE_ENV === "development") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = `${process.env.DATABASE_URL}`;

// Check if we are using Neon or a standard PostgreSQL
const isNeon = connectionString.includes("neon.tech");

let prisma: PrismaClient;

if (isNeon) {
  const adapter = new PrismaNeon({ connectionString });
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
    });
} else {
  prisma = globalForPrisma.prisma ?? new PrismaClient();
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
