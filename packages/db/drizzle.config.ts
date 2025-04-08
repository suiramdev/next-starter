import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "@repo/env";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/schema/auth.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
