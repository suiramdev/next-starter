import { schema as generatedSchema } from "./generated/zero/schema";
import type { Schema as ZeroSchema } from "@rocicorp/zero";

// Export the schema with legacy mutators disabled
export const schema = {
  ...generatedSchema,
  enableLegacyMutators: false,
} as const satisfies ZeroSchema;

// Re-export types
export * from "./generated/zero/schema";
