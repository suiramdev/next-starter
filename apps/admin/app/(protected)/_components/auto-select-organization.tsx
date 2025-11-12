"use client";

import { useAutoSelectOrganization } from "@/hooks/use-auto-select-organization";

/**
 * Client component that automatically selects an organization
 * if the user is signed in but has no active organization.
 * This component renders nothing but runs the hook logic.
 */
export function AutoSelectOrganization() {
	useAutoSelectOrganization();
	return null;
}
