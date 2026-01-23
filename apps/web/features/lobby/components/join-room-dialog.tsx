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
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function JoinRoomDialog({ children }: React.PropsWithChildren) {
	const [open, setOpen] = useState(false);
	const [code, setCode] = useState("");
	const joinRoom = useMutation(api.domains.rooms.mutations.joinRoom);
	const router = useRouter();

	const handleJoin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const roomId = await joinRoom({ code: code.toUpperCase() });
			setOpen(false);
			router.push(`/rooms/${roomId}`);
			toast.success("Joined room successfully");
		} catch (error) {
			toast.error("Failed to join room. Check the code and try again.");
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{children}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join a Room</DialogTitle>
					<DialogDescription>
						Enter the 6-character code to join a private room.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleJoin} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="code">Room Code</Label>
						<Input
							id="code"
							placeholder="XYZ123"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							maxLength={6}
							required
							className="uppercase"
						/>
					</div>
					<DialogFooter>
						<Button type="submit">Join Room</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export const JoinRoomDialogTrigger = DialogTrigger;
