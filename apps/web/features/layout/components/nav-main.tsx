"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { CompassIcon } from "@repo/ui/registry/web/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain() {
	const pathname = usePathname();
	const isActive = pathname === "/";

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild isActive={isActive}>
							<Link href="/">
								<CompassIcon />
								Explore
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
