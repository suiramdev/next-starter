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
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/registry/new-york-v4/ui/field";
import { Form } from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { LinkSpotifyButton } from "../../spotify/components/link-spotify-button";
import { SpotifyPlaylistSelector } from "../../spotify/components/spotify-playlist-selector";

interface CreateRoomFormValues {
	name: string;
	isPrivate: boolean;
	playlistId?: string;
	playlistName?: string;
	playlistImage?: string;
	playlistAuthor?: string | null;
	playlistTotalTracks?: number;
}

export function CreateRoomDialog() {
	const session = authClient.useSession();
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<CreateRoomFormValues>({
		defaultValues: {
			name: "",
			isPrivate: false,
			playlistId: undefined,
		},
	});

	const createRoom = useMutation(api.domains.rooms.mutations.createRoom);
	const hasSpotifyAccount = useQuery(
		api.domains.spotify.queries.hasSpotifyAccount,
	);

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
				playlistAuthor: data.playlistAuthor,
				playlistTotalTracks: data.playlistTotalTracks,
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
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="room-name">Room Name</FieldLabel>
										<Input
											{...field}
											id="room-name"
											placeholder="My Awesome Room"
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="isPrivate"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field
										data-invalid={fieldState.invalid}
										orientation="horizontal"
									>
										<FieldLabel htmlFor="is-private">Private Room</FieldLabel>
										<Switch
											id="is-private"
											checked={field.value}
											onCheckedChange={field.onChange}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="playlistId"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="playlist">Playlist</FieldLabel>
										{hasSpotifyAccount ? (
											<SpotifyPlaylistSelector
												value={field.value}
												onValueChange={(
													id,
													name,
													image,
													author,
													totalTracks,
												) => {
													field.onChange(id);
													form.setValue("playlistName", name);
													form.setValue("playlistImage", image);
													form.setValue("playlistAuthor", author);
													form.setValue("playlistTotalTracks", totalTracks);
												}}
												id="playlist"
											/>
										) : (
											<div className="flex flex-col gap-2">
												<span className="text-muted-foreground text-sm">
													Please connect your Spotify account to select a
													playlist.
												</span>
												<LinkSpotifyButton className="w-full" />
											</div>
										)}
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
						<DialogFooter>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
