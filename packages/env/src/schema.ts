import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  NEXT_PUBLIC_BETTER_AUTH_BASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("")
    .transform((val) => val.split(",")),
});
