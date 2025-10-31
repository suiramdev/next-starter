import { z } from "zod";

/**
 * Client-side environment variables.
 * 
 * ⚠️ This file should ONLY be imported in client-side code.
 * All client variables must be prefixed with NEXT_PUBLIC_.
 */

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BETTER_AUTH_BASE_URL: z
    .url()
    .optional()
    .default("http://localhost:3002"),
  NEXT_PUBLIC_ZERO_SERVER: z
    .url()
    .optional()
    .default("http://localhost:4848"),
});

/**
 * Parse and validate client environment variables.
 * Empty strings are treated as undefined to allow defaults to work.
 */
function parseClientEnv() {
  const env = { ...process.env };
  
  // Convert empty strings to undefined for proper default handling
  Object.keys(env).forEach((key) => {
    if (env[key] === "") {
      env[key] = undefined;
    }
  });

  return clientEnvSchema.parse(env);
}

export const env = parseClientEnv();

