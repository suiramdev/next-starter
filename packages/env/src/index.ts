import { envSchema } from "./schema";

export const env = envSchema.parse(process.env);
