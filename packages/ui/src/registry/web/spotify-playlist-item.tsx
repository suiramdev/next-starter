import Image from "next/image";
import { DiscIcon } from "#src/registry/web/icons";

interface SpotifyPlaylistItemProps {
	playlist: {
		name: string;
		image?: string;
		totalTracks: number;
		ownerName?: string;
	};
}

export function SpotifyPlaylistItem({ playlist }: SpotifyPlaylistItemProps) {
	return (
		<div className="flex min-w-0 gap-2">
			{playlist.image ? (
				<Image
					src={playlist.image}
					alt={playlist.name}
					className="rounded object-cover"
					width={32}
					height={32}
				/>
			) : (
				<div className="relative aspect-square size-8 rounded-xs bg-primary/20">
					<DiscIcon className="absolute inset-0 m-auto size-4 text-muted-foreground" />
				</div>
			)}
			<div className="flex min-w-0 flex-col">
				<span className="truncate font-medium">{playlist.name}</span>
				<span className="truncate text-muted-foreground text-xs">
					{playlist.totalTracks} tracks
					{playlist.ownerName && ` • ${playlist.ownerName}`}
				</span>
			</div>
		</div>
	);
}
