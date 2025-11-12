"use client";

import { authClient } from "@repo/auth/helpers/react/client";
import {
	CheckIcon,
	ChevronsUpDownIcon,
	PlusIcon,
} from "@repo/ui/registry/admin/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import {
	CreateOrganizationDialog,
	CreateOrganizationDialogTrigger,
} from "@/features/organizations/components/create-organization-dialog";
import { OrganizationAvatar } from "@/features/organizations/components/organization-avatar";

export function NavOrganization() {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const router = useRouter();
	const pathname = usePathname();
	const { isMobile } = useSidebar();
	const { data: organizations } = authClient.useListOrganizations();

	const handleSelect = (orgId: string) => {
		const newPathname = pathname.replace(activeOrganization?.id ?? "", orgId);
		router.replace(newPathname);
	};

	if (!activeOrganization) {
		return <OrganizationSwitcherSkeleton />;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<CreateOrganizationDialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<OrganizationAvatar organization={activeOrganization} />
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{activeOrganization.name}
									</span>
									<span className="truncate text-xs">Organization</span>
								</div>
								<ChevronsUpDownIcon className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							align="start"
							side={isMobile ? "bottom" : "right"}
							sideOffset={4}
						>
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								Organizations
							</DropdownMenuLabel>
							{organizations?.map((org) => (
								<DropdownMenuItem
									key={org.id}
									onClick={() => handleSelect(org.id)}
									className="gap-2 p-2"
								>
									<OrganizationAvatar organization={org} />
									{org.name}
									{org.id === activeOrganization?.id && (
										<CheckIcon className="ml-auto size-4" />
									)}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<CreateOrganizationDialogTrigger asChild>
								<DropdownMenuItem className="gap-2 p-2 text-muted-foreground">
									<PlusIcon className="size-4" />
									<span className="font-medium text-muted-foreground">
										Add organization
									</span>
								</DropdownMenuItem>
							</CreateOrganizationDialogTrigger>
						</DropdownMenuContent>
					</DropdownMenu>
				</CreateOrganizationDialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export function OrganizationSwitcherSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg">
					<Skeleton className="size-8 rounded-lg" />
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
