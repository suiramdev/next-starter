import { useZero as useZeroBase } from "@rocicorp/zero/react";
import type { Schema } from "../schema";

// Re-export the useZero hook from the Zero library, typed with the schema
export const useZero = useZeroBase<Schema>;

export * from "@rocicorp/zero/react";
