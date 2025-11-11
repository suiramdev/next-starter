import { z } from "zod";
import type { AuthData } from "../client";
import type { Schema } from "../schema";
import type { Transaction } from "@rocicorp/zero";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
});

/**
 * Mutator for creating a new organization.
 * Creates the organization and automatically adds the user as a member.
 */
export function createOrganizationMutator(authData: AuthData) {
  return {
    createOrganization: async (
      tx: Transaction<Schema>,
      args: unknown
    ): Promise<void> => {
      // Validate arguments
      const { name } = createOrganizationSchema.parse(args);

      const now = Date.now();
      const id = crypto.randomUUID();

      // Create the organization
      await tx.mutate.organization.insert({
        id,
        name,
        createdAt: now,
        updatedAt: now,
      });

      // Create the user-organization relationship
      await tx.mutate.user_organization.insert({
        id: crypto.randomUUID(),
        userId: authData.userId,
        organizationId: id,
        createdAt: now,
        updatedAt: now,
      });
    },
  } as const;
}
