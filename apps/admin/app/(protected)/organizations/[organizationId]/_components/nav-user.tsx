"use client";

import { ChevronsUpDownIcon } from "@repo/ui/registry/admin/icons";
import {
  CurrentUserDropdown,
  CurrentUserDropdownTrigger,
} from "@/features/users/components/current-user-dropdown";
import { UserAvatar } from "@/features/users/components/user-avatar";
import { User } from "@repo/auth";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";

type NavUserProps = {
  user?: User;
  currentOrganizationId?: string;
};

export function NavUser({ user, currentOrganizationId }: NavUserProps) {
  if (!user) return <NavUserSkeleton />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <CurrentUserDropdown currentOrganizationId={currentOrganizationId}>
          <CurrentUserDropdownTrigger asChild>
            <SidebarMenuButton size="lg">
              <UserAvatar user={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
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
