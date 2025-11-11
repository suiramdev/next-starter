"use client";

import { ZeroProvider } from "@repo/zero/helpers/react";
import { authClient } from "@repo/auth/helpers/react/client";
import { schema } from "@repo/db/zero";
import { createMutators } from "@repo/zero/mutators";

type QueryProviderProps = {
  children: React.ReactNode;
};

/**
 * Fetches a Zero auth token from the API endpoint.
 * @returns Promise that resolves to the token string or undefined
 */
async function fetchZeroToken(): Promise<string | undefined> {
  try {
    if (!process.env.NEXT_PUBLIC_ZERO_TOKEN_URL) {
      throw new Error("NEXT_PUBLIC_ZERO_TOKEN_URL is not set");
    }

    const response = await fetch(process.env.NEXT_PUBLIC_ZERO_TOKEN_URL, {
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data.token ?? undefined;
  } catch (error) {
    console.error("Failed to fetch Zero token:", error);
    return undefined;
  }
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { data: session } = authClient.useSession();

  // Get user ID from auth session, fallback to 'anon' if not authenticated
  const userID = session?.user?.id ?? "anon";

  // Create mutators for the client
  const mutators = createMutators({ userId: userID });

  // Use userId as key to force remount when user changes
  // This ensures the old Zero client is properly cleaned up before creating a new one
  return (
    <ZeroProvider
      // Remount the ZeroProvider when the userID changes
      key={userID}
      {...{
        userID,
        auth: session?.user?.id ? fetchZeroToken : undefined,
        server: process.env.NEXT_PUBLIC_ZERO_SERVER_URL,
        schema,
        mutators,
      }}
    >
      {children}
    </ZeroProvider>
  );
}
