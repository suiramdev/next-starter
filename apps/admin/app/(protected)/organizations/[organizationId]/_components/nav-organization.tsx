"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsUpDownIcon,
  PlusIcon,
  CheckIcon,
} from "@repo/ui/registry/admin/icons";
import { authClient } from "@repo/auth/helpers/react/client";
import { useQuery } from "@repo/zero/helpers/react";
import { getOrganizations } from "@repo/zero/queries";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { OrganizationAvatar } from "@/features/organizations/components/organization-avatar";
import {
  CreateOrganizationDialog,
  CreateOrganizationDialogTrigger,
} from "@/features/organizations/components/create-organization-dialog";

type NavOrganizationProps = {
  currentOrganizationId?: string;
};

export function NavOrganization({
  currentOrganizationId,
}: NavOrganizationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? "anon";
  const [organizations] = useQuery(getOrganizations({ userId }));

  const currentOrganization = organizations?.find(
    (org) => org.id === currentOrganizationId
  );

  const handleSelect = (orgId: string) => {
    const newPathname = pathname.replace(currentOrganizationId ?? "", orgId);
    router.replace(newPathname);
  };

  if (!currentOrganization) {
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
                <OrganizationAvatar organization={currentOrganization} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentOrganization.name}
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
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSelect(org.id)}
                  className="gap-2 p-2"
                >
                  <OrganizationAvatar organization={org} />
                  {org.name}
                  {org.id === currentOrganizationId && (
                    <CheckIcon className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <CreateOrganizationDialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2 text-muted-foreground">
                  <PlusIcon className="size-4" />
                  <span className="text-muted-foreground font-medium">
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
