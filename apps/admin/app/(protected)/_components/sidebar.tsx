import {
  Sidebar as SidebarComponent,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavOrganization } from "./nav-organization";

export function Sidebar() {
  return (
    <SidebarComponent variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavOrganization />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </SidebarComponent>
  );
}
