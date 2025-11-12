"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@repo/auth/helpers/react/client";

/**
 * Hook that automatically selects the first available organization
 * if the user is signed in but has no active organization.
 */
export function useAutoSelectOrganization() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: session } = authClient.useSession();
  const hasAttemptedAutoSelect = useRef(false);

  useEffect(() => {
    // Only run if:
    // 1. User is signed in
    // 2. No active organization
    // 3. Organizations are loaded
    // 4. There's at least one organization available
    // 5. We haven't already attempted to auto-select
    if (
      session?.user &&
      !activeOrganization &&
      organizations &&
      organizations.length > 0 &&
      !hasAttemptedAutoSelect.current
    ) {
      hasAttemptedAutoSelect.current = true;

      // Select the first organization
      const firstOrg = organizations[0];
      if (firstOrg?.id) {
        authClient.organization
          .setActive({
            organizationId: firstOrg.id,
          })
          .catch((error) => {
            // Silently fail - organization might already be set or user might not have permission
            console.error("Failed to auto-select organization:", error);
          });
      }
    }

    // Reset the flag if the user signs out or gets an active organization
    if (!session?.user || activeOrganization) {
      hasAttemptedAutoSelect.current = false;
    }
  }, [session, activeOrganization, organizations]);
}
