import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@repo/db/prisma";
import { ac, roles } from "./permissions";

/**
 * This is the auth service.
 * It is used to interact with the auth service.
 *
 * @see https://docs.better-auth.com/server/configuration
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? [],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Create a personal organization for the user
          try {
            const userName = user.name || user.email.split("@")[0];
            const organizationName = `${userName}'s Organization`;

            // Create the organization
            const organization = await prisma.organization.create({
              data: {
                name: organizationName,
              },
            });

            // Link the user to the organization
            await prisma.userOrganization.create({
              data: {
                userId: user.id,
                organizationId: organization.id,
              },
            });
          } catch (error) {
            // Log error but don't throw to avoid breaking sign-up flow
            console.error(
              "Failed to create personal organization for user:",
              error
            );
          }
        },
      },
    },
  },
  plugins: [
    admin({
      ac,
      roles,
    }),
  ],
});
