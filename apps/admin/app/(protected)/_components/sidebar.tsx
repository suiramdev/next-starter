import {
	Sidebar as SidebarComponent,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavOrganization } from "./nav-organization";
import { NavUser } from "./nav-user";

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
