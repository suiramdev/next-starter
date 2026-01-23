"use client";

import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import {
	CreateRoomDialog,
	CreateRoomDialogTrigger,
} from "@/features/lobby/components/create-room-dialog";

export function SidebarCTA() {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<CreateRoomDialog>
					<CreateRoomDialogTrigger asChild>
						<Button className="w-full" size="sm">
							Create your first game
						</Button>
					</CreateRoomDialogTrigger>
				</CreateRoomDialog>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

