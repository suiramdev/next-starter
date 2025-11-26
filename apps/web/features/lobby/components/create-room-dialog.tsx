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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { ConnectSpotifyButton } from "../../../components/connect-spotify-button";
import { SpotifyPlaylistSelector } from "../../../components/spotify-playlist-selector";

interface CreateRoomFormValues {
	name: string;
	isPrivate: boolean;
	playlistId?: string;
	playlistName?: string;
	playlistImage?: string;
}

export function CreateRoomDialog() {
	const session = authClient.useSession();
	const [open, setOpen] = useState(false);

	const form = useForm<CreateRoomFormValues>({
		defaultValues: {
			name: "",
			isPrivate: false,
			playlistId: undefined,
		},
	});

	const createRoom = useMutation(api.mutations.rooms.createRoom);
	const isLinked = useQuery(api.queries.spotify.isLinked);
	const router = useRouter();

	const handleOpenChange = (isOpen: boolean) => {
		if (isOpen && !form.getValues("name")) {
			const userName = session.data?.user?.name;
			if (userName) {
				form.setValue("name", `${userName}'s room`);
			}
		}
		setOpen(isOpen);
	};

	const onSubmit = async (data: CreateRoomFormValues) => {
		try {
			const roomId = await createRoom({
				name: data.name,
				isPrivate: data.isPrivate,
				playlistId: data.playlistId,
				playlistName: data.playlistName,
				playlistImage: data.playlistImage,
			});
			setOpen(false);
			form.reset();
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Room Name</FormLabel>
									<FormControl>
										<Input placeholder="My Awesome Room" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isPrivate"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between space-x-2">
									<FormLabel>Private Room</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="playlistId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Playlist</FormLabel>
									<FormControl>
										{isLinked ? (
											<SpotifyPlaylistSelector
												value={field.value}
												onValueChange={(id, name, image) => {
													field.onChange(id);
													form.setValue("playlistName", name);
													form.setValue("playlistImage", image);
												}}
											/>
										) : (
											<div className="flex flex-col gap-2">
												<span className="text-muted-foreground text-sm">
													You must connect your Spotify account to choose a
													playlist
												</span>
												<ConnectSpotifyButton className="w-full" />
											</div>
										)}
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
