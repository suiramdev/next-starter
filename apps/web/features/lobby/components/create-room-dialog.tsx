"use client";

import { api } from "@repo/convex/_generated/api";
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
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function CreateRoomDialog() {
	const session = authClient.useSession();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const createRoom = useMutation(api.mutations.rooms.createRoom);
	const router = useRouter();

	const handleOpenChange = (isOpen: boolean) => {
		if (isOpen && !name) {
			const userName = session.data?.user?.name;
			if (userName) {
				setName(`${userName}'s room`);
			}
		}
		setOpen(isOpen);
	};

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const roomId = await createRoom({ name, isPrivate });
			setOpen(false);
			router.push(`/rooms/${roomId}`);
			toast.success("Room created successfully");
		} catch (error) {
			toast.error("Failed to create room");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button>Create Room</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a New Room</DialogTitle>
					<DialogDescription>
						Start a new game room for others to join.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleCreate} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Room Name</Label>
						<Input
							id="name"
							placeholder="My Awesome Room"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="flex items-center justify-between space-x-2">
						<Label htmlFor="private">Private Room</Label>
						<Switch
							id="private"
							checked={isPrivate}
							onCheckedChange={setIsPrivate}
						/>
					</div>
					<DialogFooter>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
