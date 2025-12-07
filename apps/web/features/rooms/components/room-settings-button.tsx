"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@repo/convex/_generated/api";
import type { Id } from "@repo/convex/_generated/dataModel";
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
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@repo/ui/registry/new-york-v4/ui/drawer";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/registry/new-york-v4/ui/field";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { SettingsIcon } from "@repo/ui/registry/web/icons";
import {
	type Preloaded,
	useMutation,
	usePreloadedQuery,
	useQuery,
} from "convex/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { LinkSpotifyButton } from "@/features/spotify/components/link-spotify-button";
import { SpotifyPlaylistSelector } from "@/features/spotify/components/spotify-playlist-selector";
import { useMediaQuery } from "@/hooks/use-media-query";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Room name is required")
		.max(50, "Room name must be at most 50 characters"),
	isPrivate: z.boolean(),
	playlistId: z.string().optional(),
	playlistName: z.string().optional(),
	playlistImage: z.string().optional(),
	playlistAuthor: z.string().optional(),
	playlistTotalTracks: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoomSettingsButtonProps {
	preloadedQuery: Preloaded<typeof api.domains.rooms.queries.getRoom>;
	roomId: Id<"rooms">;
}

export function RoomSettingsButton({
	preloadedQuery,
	roomId,
}: RoomSettingsButtonProps) {
	const { data: session } = authClient.useSession();
	const room = usePreloadedQuery(preloadedQuery);
	const hasSpotifyLinked = useQuery(
		api.domains.spotify.queries.hasSpotifyAccount,
	);
	const updateRoom = useMutation(api.domains.rooms.mutations.updateRoom);

	const [open, setOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: room.name,
			isPrivate: room.isPrivate,
			playlistId: room.playlistId ?? undefined,
			playlistName: room.playlistName ?? undefined,
			playlistImage: room.playlistImage ?? undefined,
			playlistAuthor: room.playlistAuthor ?? undefined,
			playlistTotalTracks: room.playlistTotalTracks ?? undefined,
		},
	});

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			form.reset({
				name: room.name,
				isPrivate: room.isPrivate,
				playlistId: room.playlistId ?? undefined,
				playlistName: room.playlistName ?? undefined,
				playlistImage: room.playlistImage ?? undefined,
				playlistAuthor: room.playlistAuthor ?? undefined,
				playlistTotalTracks: room.playlistTotalTracks ?? undefined,
			});
		}
	}, [open, room, form]);

	const isHost = session?.user?.id === room.hostId;

	// Only host can access settings
	if (!isHost) {
		return null;
	}

	const handlePlaylistChange = (
		id: string,
		pName?: string,
		pImage?: string,
		_pAuthor?: string | null,
		pTotalTracks?: number,
	) => {
		form.setValue("playlistId", id);
		form.setValue("playlistName", pName);
		form.setValue("playlistImage", pImage);
		form.setValue("playlistTotalTracks", pTotalTracks);
	};

	const onSubmit = async (data: FormValues) => {
		setIsSaving(true);
		try {
			await updateRoom({
				roomId,
				name: data.name !== room.name ? data.name : undefined,
				isPrivate:
					data.isPrivate !== room.isPrivate ? data.isPrivate : undefined,
				playlistId:
					data.playlistId !== room.playlistId ? data.playlistId : undefined,
				playlistName:
					data.playlistName !== room.playlistName
						? data.playlistName
						: undefined,
				playlistImage:
					data.playlistImage !== room.playlistImage
						? data.playlistImage
						: undefined,
				playlistTotalTracks:
					data.playlistTotalTracks !== room.playlistTotalTracks
						? data.playlistTotalTracks
						: undefined,
			});
			setOpen(false);
		} finally {
			setIsSaving(false);
		}
	};

	const formContent = (
		<form
			id="room-settings-form"
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex min-w-0 flex-col gap-6 overflow-hidden"
		>
			<FieldGroup>
				{/* Room Name */}
				<Controller
					name="name"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="room-name">Room Name</FieldLabel>
							<Input
								{...field}
								id="room-name"
								aria-invalid={fieldState.invalid}
								placeholder="Enter room name"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{/* Private Toggle */}
				<Controller
					name="isPrivate"
					control={form.control}
					render={({ field }) => (
						<Field orientation="horizontal">
							<FieldContent>
								<FieldLabel htmlFor="is-private">Private Room</FieldLabel>
								<FieldDescription>
									Only players with the code can join
								</FieldDescription>
							</FieldContent>
							<Switch
								id="is-private"
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</Field>
					)}
				/>

				{/* Playlist Selector */}
				<Field>
					<FieldLabel htmlFor="playlist">Playlist</FieldLabel>
					{hasSpotifyLinked ? (
						<SpotifyPlaylistSelector
							id="playlist"
							value={form.watch("playlistId")}
							onValueChange={handlePlaylistChange}
							initialPlaylist={
								form.watch("playlistId")
									? {
											name: form.watch("playlistName") ?? "Unknown Playlist",
											image: form.watch("playlistImage") ?? undefined,
											author: form.watch("playlistAuthor") ?? undefined,
											totalTracks: form.watch("playlistTotalTracks"),
										}
									: undefined
							}
						/>
					) : (
						<div className="flex flex-col gap-2">
							<FieldDescription>
								Link your Spotify account to select a playlist
							</FieldDescription>
							<LinkSpotifyButton className="w-full" />
						</div>
					)}
				</Field>
			</FieldGroup>
		</form>
	);

	if (isDesktop) {
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
						<DialogDescription>
							Configure your room settings. Changes are saved when you click
							save.
						</DialogDescription>
					</DialogHeader>
					{formContent}
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit" form="room-settings-form" disabled={isSaving}>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" size="icon">
					<SettingsIcon className="size-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Room Settings</DrawerTitle>
					<DrawerDescription>Configure your room settings.</DrawerDescription>
				</DrawerHeader>
				<div className="px-4">{formContent}</div>
				<DrawerFooter>
					<Button type="submit" form="room-settings-form" disabled={isSaving}>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
