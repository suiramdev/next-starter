import { createBuilder } from "@rocicorp/zero";
import { schema } from "@repo/db/zero";

export const builder = createBuilder(schema);

// Re-exports the schema from the database package for convenience
export * from "@repo/db/zero";
