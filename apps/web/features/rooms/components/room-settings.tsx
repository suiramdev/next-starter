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
import { Separator } from "@repo/ui/registry/new-york-v4/ui/separator";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { SettingsIcon } from "@repo/ui/registry/web/icons";
import { useEffect, useState } from "react";
import { SpotifyPlaylistSelector } from "../../spotify/components/spotify-playlist-selector";

interface PlaylistData {
	id: string;
	name: string;
	image?: string;
	author?: string | null;
}

interface RoomSettingsProps {
	name: string;
	isPrivate: boolean;
	playlist?: PlaylistData | null;
	onUpdate: (data: {
		name?: string;
		isPrivate?: boolean;
		playlistId?: string;
		playlistName?: string;
		playlistImage?: string;
	}) => Promise<void>;
}

export function RoomSettings({
	name: initialName,
	isPrivate: initialIsPrivate,
	playlist: initialPlaylist,
	onUpdate,
}: RoomSettingsProps) {
	const [name, setName] = useState(initialName);
	const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
	const [playlist, setPlaylist] = useState<PlaylistData | null>(
		initialPlaylist ?? null,
	);
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Sync state when props change (e.g., real-time updates from other sources)
	useEffect(() => {
		setName(initialName);
		setIsPrivate(initialIsPrivate);
		setPlaylist(initialPlaylist ?? null);
	}, [initialName, initialIsPrivate, initialPlaylist]);

	const handlePlaylistChange = (
		id: string,
		name?: string,
		image?: string,
		author?: string | null,
	) => {
		setPlaylist({ id, name: name ?? "", image, author });
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			await onUpdate({
				name,
				isPrivate,
				playlistId: playlist?.id,
				playlistName: playlist?.name,
				playlistImage: playlist?.image,
			});
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
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Room Settings</DialogTitle>
					<DialogDescription>
						Configure your room and choose a playlist.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-4">
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
									Only people with the code can join
								</div>
							</div>
							<Switch
								id="private"
								checked={isPrivate}
								onCheckedChange={setIsPrivate}
							/>
						</div>
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="playlist">Playlist</Label>
						<p className="text-muted-foreground text-sm">
							Search and select a Spotify playlist for the game
						</p>
						<div className="h-12">
							<SpotifyPlaylistSelector
								id="playlist"
								value={playlist?.id}
								onValueChange={handlePlaylistChange}
							/>
						</div>
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
