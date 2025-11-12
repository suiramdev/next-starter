"use client";

import { authClient } from "@repo/auth/helpers/react/client";
import { ChevronsUpDownIcon } from "@repo/ui/registry/admin/icons";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import {
	CurrentUserDropdown,
	CurrentUserDropdownTrigger,
} from "@/features/users/components/current-user-dropdown";
import { UserAvatar } from "@/features/users/components/user-avatar";

export function NavUser() {
	const { data: session } = authClient.useSession();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	if (!session) return <NavUserSkeleton />;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<CurrentUserDropdown currentOrganizationId={activeOrganization?.id}>
					<CurrentUserDropdownTrigger asChild>
						<SidebarMenuButton size="lg">
							<UserAvatar
								user={{
									image: session.user.image,
									name: session.user.name,
								}}
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{session.user.name}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{session.user.email}
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
