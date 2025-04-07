import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/db";
import * as authSchema from "@repo/db/schema/auth";
import { env } from "@repo/env";

/**
 * This is the auth service.
 * It is used to interact with the auth service.
 *
 * @see https://docs.better-auth.com/server/configuration
 */
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export type { User } from "better-auth";
