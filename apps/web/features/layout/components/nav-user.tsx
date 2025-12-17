"use client";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { ChevronsUpDown } from "@repo/ui/registry/web/icons";
import {
	CurrentUserDropdown,
	CurrentUserDropdownTrigger,
} from "@/features/users/components/current-user-dropdown";
import { UserAvatar } from "@/features/users/components/user-avatar";
import { authClient } from "@/lib/auth-client";

export function NavUser() {
	const { data: session } = authClient.useSession();

	if (!session) return <NavUserSkeleton />;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<CurrentUserDropdown>
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
									{session.user.name ?? "Unknown"}
								</span>
								{session.user.email && (
									<span className="truncate text-muted-foreground text-xs">
										{session.user.email}
									</span>
								)}
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
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
