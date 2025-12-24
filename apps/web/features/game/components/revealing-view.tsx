import { TrackRevealCard } from "@repo/ui/registry/web/track-reveal-card";

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
		<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
			<TrackRevealCard
				trackTitle={trackTitle}
				trackArtist={trackArtist}
				trackImage={trackImage}
			/>
		</div>
	);
}
