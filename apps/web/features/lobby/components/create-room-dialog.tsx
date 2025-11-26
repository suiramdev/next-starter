"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createRoomSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	isPrivate: z.boolean().default(false),
});

type CreateRoomValues = z.infer<typeof createRoomSchema>;

export function CreateRoomDialog() {
	const [open, setOpen] = useState(false);
	const createRoom = useMutation(api.mutations.rooms.createRoom);
	const router = useRouter();

	const form = useForm<CreateRoomValues>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			name: "",
			isPrivate: false,
		},
	});

	const onSubmit = async (values: CreateRoomValues) => {
		try {
			const roomId = await createRoom(values);
			setOpen(false);
			router.push(`/rooms/${roomId}`);
			toast.success("Room created successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to create room");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Room</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a Room</DialogTitle>
					<DialogDescription>
						Create a new game lobby for you and your friends.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Room Name</FormLabel>
									<FormControl>
										<Input placeholder="My awesome room" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isPrivate"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Private Room</FormLabel>
										<FormDescription>
											Only users with the code can join
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
