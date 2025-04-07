import { z } from "zod";

export const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  DATABASE_URL: z.string(),
});
