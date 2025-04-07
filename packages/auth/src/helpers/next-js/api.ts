import { auth } from "@/index";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * This is the handler for the API routes in next.js
 *
 * @param authManager - The auth manager instance
 * @returns The handler for the API routes in next.js
 */
export function authHandler() {
  return toNextJsHandler(auth.handler);
}
