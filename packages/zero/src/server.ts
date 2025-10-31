import { Pool } from "pg";
import { zeroNodePg } from "@rocicorp/zero/server/adapters/pg";
import { schema } from "./schema";
import { env } from "@repo/env/server";

/**
 * Creates a ZQLDatabase instance for server-side ZQL queries.
 * This allows you to run ZQL queries directly against your Postgres database.
 *
 * @see https://zero.rocicorp.dev/docs/zql-on-the-server
 */
const globalForZeroDb = globalThis as unknown as {
  zeroDb: ReturnType<typeof zeroNodePg>;
};

export const zeroDb =
  globalForZeroDb.zeroDb ||
  zeroNodePg(
    schema,
    new Pool({
      connectionString: env.ZERO_UPSTREAM_DB,
    })
  );

if (process.env.NODE_ENV !== "production") {
  globalForZeroDb.zeroDb = zeroDb;
}
