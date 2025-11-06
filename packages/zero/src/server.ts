import { Pool } from "pg";
import { zeroNodePg } from "@rocicorp/zero/server/adapters/pg";
import { schema } from "@repo/db/zero";
import { env } from "@repo/env/server";

export const pool = new Pool({
  connectionString: env.ZERO_UPSTREAM_DB,
});

export const zeroDb = zeroNodePg(schema, pool);

// Re-export the server functions from the Zero library for convenience
export * from "@rocicorp/zero/server";
