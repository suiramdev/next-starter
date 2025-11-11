import { useZero as useZeroBase } from "@rocicorp/zero/react";
import type { Schema } from "../schema";
import type { Mutators } from "../mutators";

// Re-export the useZero hook from the Zero library, typed with the schema
export const useZero = useZeroBase<Schema, Mutators>;

export * from "@rocicorp/zero/react";
