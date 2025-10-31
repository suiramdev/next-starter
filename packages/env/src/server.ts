import { z } from "zod";

/**
 * Server-side environment variables.
 *
 * ⚠️ This file should ONLY be imported in server-side code.
 * Never import this in client-side code to prevent exposing sensitive variable names.
 */

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("")
    .transform((val) => val.split(",")),
  ZERO_UPSTREAM_DB: z
    .url()
    .optional()
    .default("postgresql://postgres:postgres@localhost:5432/postgres"),
  ZERO_REPLICA_FILE: z.string().optional().default("/tmp/sync-replica.db"),
  ZERO_AUTH_SECRET: z.string(),
});

/**
 * Parse and validate server environment variables.
 * Empty strings are treated as undefined to allow defaults to work.
 */
function parseServerEnv() {
  const env = { ...process.env };

  // Convert empty strings to undefined for proper default handling
  Object.keys(env).forEach((key) => {
    if (env[key] === "") {
      env[key] = undefined;
    }
  });

  return serverEnvSchema.parse(env);
}

export const env = parseServerEnv();
