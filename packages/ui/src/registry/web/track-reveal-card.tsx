import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { TrackImage } from "@repo/ui/registry/web/track-image";

interface TrackRevealCardProps {
	trackTitle?: string;
	trackArtist?: string;
	trackImage?: string;
}

export function TrackRevealCard({
	trackTitle,
	trackArtist,
	trackImage,
}: TrackRevealCardProps) {
	return (
		<Card className="w-full max-w-sm">
			<CardContent className="flex flex-row items-center gap-4 p-6">
				<div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
					<TrackImage
						src={trackImage}
						alt={trackTitle ?? "Album cover"}
						fill
						className="rounded-lg"
					/>
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<CardTitle className="font-bold text-xl tracking-tight">
						{trackTitle ?? "Unknown Title"}
					</CardTitle>
					<p className="text-base text-muted-foreground">
						{trackArtist ?? "Unknown Artist"}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

