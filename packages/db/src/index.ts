import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { env } from "@repo/env";
import type { DB } from "./generated/types";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});

// Export Prisma client for complex operations and migrations
export type { PrismaClient } from "./generated/prisma";
export { prisma } from "./prisma";

// Export the database types
export type * from "./generated/types";
