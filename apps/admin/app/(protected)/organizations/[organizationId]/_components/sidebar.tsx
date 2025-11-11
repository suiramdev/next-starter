"use client";

import { useParams } from "next/navigation";
import {
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { authClient } from "@repo/auth/helpers/react/client";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavOrganization } from "./nav-organization";

export function Sidebar() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { data: session } = authClient.useSession();

  return (
    <SidebarComponent variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavOrganization currentOrganizationId={organizationId} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain currentOrganizationId={organizationId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={session?.user ?? undefined}
          currentOrganizationId={organizationId}
        />
      </SidebarFooter>
    </SidebarComponent>
  );
}
