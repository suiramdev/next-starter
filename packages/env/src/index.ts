/**
 * Default export - exports server environment variables.
 *
 * ⚠️ IMPORTANT: For client-side code, use `@repo/env/client` instead.
 * This default export is server-only to prevent exposing server variable
 * names to the client bundle.
 *
 * Usage:
 * - Server-side: `import { env } from "@repo/env"` or `import { env } from "@repo/env/server"`
 * - Client-side: `import { env } from "@repo/env/client"`
 */

export { env } from "./server";
