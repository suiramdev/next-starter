import { z } from "zod";
import type { AuthData } from "../client";
import type { Schema } from "../schema";
import type { Transaction } from "@rocicorp/zero";

const banUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  banReason: z.string().optional().nullable(),
  banExpires: z.number().optional().nullable(),
});

const deleteUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  emailVerified: z.boolean().optional(),
});

/**
 * Mutators for user management operations.
 * These mutators prevent users from banning or deleting themselves.
 */
export function createUserMutator(authData: AuthData) {
  return {
    /**
     * Ban a user with optional reason and expiration date.
     * Prevents users from banning themselves.
     */
    banUser: async (
      tx: Transaction<Schema>,
      args: unknown
    ): Promise<void> => {
      // Validate arguments
      const { userId, banReason, banExpires } = banUserSchema.parse(args);

      // Prevent users from banning themselves
      if (userId === authData.userId) {
        throw new Error("You cannot ban yourself");
      }

      // Check if user exists
      const user = await tx.query.user
        .where((eb) => eb.cmp("id", userId))
        .one();
      if (!user) {
        throw new Error("User not found");
      }

      const now = Date.now();

      // Update the user with ban information
      await tx.mutate.user.update({
        id: userId,
        banned: true,
        banReason: banReason ?? null,
        banExpires: banExpires ?? null,
        updatedAt: now,
      });
    },

    /**
     * Delete a user.
     * Prevents users from deleting themselves.
     */
    deleteUser: async (
      tx: Transaction<Schema>,
      args: unknown
    ): Promise<void> => {
      // Validate arguments
      const { userId } = deleteUserSchema.parse(args);

      // Prevent users from deleting themselves
      if (userId === authData.userId) {
        throw new Error("You cannot delete yourself");
      }

      // Check if user exists
      const user = await tx.query.user
        .where((eb) => eb.cmp("id", userId))
        .one();
      if (!user) {
        throw new Error("User not found");
      }

      // Delete the user
      await tx.mutate.user.delete({ id: userId });
    },

    /**
     * Update user properties (name, email, role, image, emailVerified).
     * Prevents users from modifying certain properties of themselves if needed.
     * Note: This allows users to update themselves, but you can add restrictions if needed.
     */
    updateUser: async (
      tx: Transaction<Schema>,
      args: unknown
    ): Promise<void> => {
      // Validate arguments
      const { userId, ...updates } = updateUserSchema.parse(args);

      // Check if user exists
      const user = await tx.query.user
        .where((eb) => eb.cmp("id", userId))
        .one();
      if (!user) {
        throw new Error("User not found");
      }

      const now = Date.now();

      // Build update object with only provided fields
      const updateData: Partial<Schema["tables"]["user"]["$inferInsert"]> = {
        id: userId,
        updatedAt: now,
      };

      if (updates.name !== undefined) {
        updateData.name = updates.name;
      }
      if (updates.email !== undefined) {
        updateData.email = updates.email;
      }
      if (updates.role !== undefined) {
        updateData.role = updates.role;
      }
      if (updates.image !== undefined) {
        updateData.image = updates.image;
      }
      if (updates.emailVerified !== undefined) {
        updateData.emailVerified = updates.emailVerified;
      }

      // Update the user
      await tx.mutate.user.update(updateData);
    },
  } as const;
}

