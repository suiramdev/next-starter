"use client";

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
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { SettingsIcon } from "@repo/ui/registry/web/icons";
import {
	type Preloaded,
	useMutation,
	usePreloadedQuery,
	useQuery,
} from "convex/react";
import { useEffect, useState } from "react";
import { LinkSpotifyButton } from "@/features/spotify/components/link-spotify-button";
import { SpotifyPlaylistSelector } from "@/features/spotify/components/spotify-playlist-selector";
import { useMediaQuery } from "@/hooks/use-media-query";
import { authClient } from "@/lib/auth-client";

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

	// Form state
	const [name, setName] = useState(room.name);
	const [isPrivate, setIsPrivate] = useState(room.isPrivate);
	const [playlistId, setPlaylistId] = useState(room.playlistId);
	const [playlistName, setPlaylistName] = useState(room.playlistName);
	const [playlistImage, setPlaylistImage] = useState(room.playlistImage);

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			setName(room.name);
			setIsPrivate(room.isPrivate);
			setPlaylistId(room.playlistId);
			setPlaylistName(room.playlistName);
			setPlaylistImage(room.playlistImage);
		}
	}, [open, room]);

	const isHost = session?.user?.id === room.hostId;

	// Only host can access settings
	if (!isHost) {
		return null;
	}

	const handlePlaylistChange = (
		id: string,
		pName?: string,
		pImage?: string,
	) => {
		setPlaylistId(id);
		setPlaylistName(pName);
		setPlaylistImage(pImage);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await updateRoom({
				roomId,
				name: name !== room.name ? name : undefined,
				isPrivate: isPrivate !== room.isPrivate ? isPrivate : undefined,
				playlistId: playlistId !== room.playlistId ? playlistId : undefined,
				playlistName:
					playlistName !== room.playlistName ? playlistName : undefined,
				playlistImage:
					playlistImage !== room.playlistImage ? playlistImage : undefined,
			});
			setOpen(false);
		} finally {
			setIsSaving(false);
		}
	};

	const formContent = (
		<div className="flex flex-col gap-6">
			{/* Room Name */}
			<div className="flex flex-col gap-2">
				<Label htmlFor="room-name">Room Name</Label>
				<Input
					id="room-name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter room name"
				/>
			</div>

			{/* Private Toggle */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-col gap-1">
					<Label htmlFor="is-private">Private Room</Label>
					<p className="text-muted-foreground text-sm">
						Only players with the code can join
					</p>
				</div>
				<Switch
					id="is-private"
					checked={isPrivate}
					onCheckedChange={setIsPrivate}
				/>
			</div>

			{/* Playlist Selector */}
			<div className="flex flex-col gap-2">
				<Label htmlFor="playlist">Playlist</Label>
				{hasSpotifyLinked ? (
					<SpotifyPlaylistSelector
						id="playlist"
						value={playlistId}
						onValueChange={handlePlaylistChange}
					/>
				) : (
					<div className="flex flex-col gap-2">
						<p className="text-muted-foreground text-sm">
							Link your Spotify account to select a playlist
						</p>
						<LinkSpotifyButton className="w-full" />
					</div>
				)}
			</div>
		</div>
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
						<Button onClick={handleSave} disabled={isSaving}>
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
					<Button onClick={handleSave} disabled={isSaving}>
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
