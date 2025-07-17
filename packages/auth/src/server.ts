import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@repo/db";
import { env } from "@repo/env";
import { ac, roles } from "./permissions";

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
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles,
    }),
  ],
});
