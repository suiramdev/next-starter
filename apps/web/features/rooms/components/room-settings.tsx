"use client";

import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dialog";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { SettingsIcon } from "@repo/ui/registry/web/icons";
import { useState } from "react";

interface RoomSettingsProps {
	name: string;
	isPrivate: boolean;
	onUpdate: (data: { name: string; isPrivate: boolean }) => Promise<void>;
}

export function RoomSettings({
	name: initialName,
	isPrivate: initialIsPrivate,
	onUpdate,
}: RoomSettingsProps) {
	const [name, setName] = useState(initialName);
	const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async () => {
		try {
			setIsLoading(true);
			await onUpdate({ name, isPrivate });
			setOpen(false);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<SettingsIcon className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Room Settings</DialogTitle>
					<DialogDescription>Manage your room preferences.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Room Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter room name"
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="private">Private Room</Label>
							<div className="text-muted-foreground text-sm">
								Only people with the link/code can join
							</div>
						</div>
						<Switch
							id="private"
							checked={isPrivate}
							onCheckedChange={setIsPrivate}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
