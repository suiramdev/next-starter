import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
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
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});
