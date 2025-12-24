import {
	Card,
	CardContent,
} from "@repo/ui/registry/new-york-v4/ui/card";
import { TrackImage } from "@repo/ui/registry/web/track-image";

interface RevealingViewProps {
	trackTitle?: string;
	trackArtist?: string;
	trackImage?: string;
}

export function RevealingView({
	trackTitle,
	trackArtist,
	trackImage,
}: RevealingViewProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center overflow-auto px-4">
			<Card className="w-full max-w-md">
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
						<h3 className="font-bold text-xl tracking-tight">
							{trackTitle ?? "Unknown Title"}
						</h3>
						<p className="text-base text-muted-foreground">
							{trackArtist ?? "Unknown Artist"}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
