"use client";

import type { api } from "@repo/convex/_generated/api";
import { ChevronsUpDownIcon } from "@repo/ui/registry/admin/icons";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import {
	CurrentUserDropdown,
	CurrentUserDropdownTrigger,
} from "@/features/users/components/current-user-dropdown";
import { UserAvatar } from "@/features/users/components/user-avatar";

type NavUserProps = {
	preloadedQuery: Preloaded<typeof api.domains.users.queries.getUser>;
};

export function NavUser({ preloadedQuery }: NavUserProps) {
	const user = usePreloadedQuery(preloadedQuery);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<CurrentUserDropdown>
					<CurrentUserDropdownTrigger asChild>
						<SidebarMenuButton size="lg">
							<UserAvatar
								user={{
									image: user.image,
									name: user.name,
								}}
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-muted-foreground text-xs">
									{user.email}
								</span>
							</div>
							<ChevronsUpDownIcon className="ml-auto size-4" />
						</SidebarMenuButton>
					</CurrentUserDropdownTrigger>
				</CurrentUserDropdown>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export function NavUserSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<Skeleton className="size-10 rounded-full" />
					<div className="grid flex-1 text-left text-sm leading-tight">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="ml-auto size-4" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
