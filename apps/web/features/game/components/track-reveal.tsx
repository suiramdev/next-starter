"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { TrophyIcon } from "@repo/ui/registry/web/icons";
import { TrackImage } from "@repo/ui/registry/web/track-image";

interface GameScore {
	userId: string;
	totalPoints: number;
	user: {
		_id: string;
		name: string;
		image?: string | null;
	} | null;
}

interface TrackRevealProps {
	trackTitle?: string;
	trackArtist?: string;
	trackImage?: string;
	artistGuessedBy?: string;
	titleGuessedBy?: string;
	gameScores: GameScore[];
}

export function TrackReveal({
	trackTitle,
	trackArtist,
	trackImage,
	artistGuessedBy,
	titleGuessedBy,
	gameScores,
}: TrackRevealProps) {
	const artistGuesser = gameScores.find((s) => s.userId === artistGuessedBy);
	const titleGuesser = gameScores.find((s) => s.userId === titleGuessedBy);

	return (
		<div className="flex flex-col items-center gap-6 rounded-xl border bg-linear-to-br from-primary/5 via-card to-card/50 p-8">
			<TrackImage
				src={trackImage}
				alt={trackTitle ?? "Album cover"}
				width={200}
				height={200}
			/>

			{/* Track info */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h2 className="font-bold text-2xl tracking-tight md:text-3xl">
					{trackTitle ?? "Unknown Title"}
				</h2>
				<p className="text-lg text-muted-foreground">
					{trackArtist ?? "Unknown Artist"}
				</p>
			</div>

			{/* First guessers */}
			<div className="flex flex-wrap items-center justify-center gap-4">
				{artistGuesser && (
					<Badge variant="outline" className="gap-2 px-3 py-2">
						<TrophyIcon className="size-4 text-yellow-500" />
						<span className="text-muted-foreground">Artist:</span>
						<Avatar className="size-5">
							<AvatarImage src={artistGuesser.user?.image ?? undefined} />
							<AvatarFallback className="text-[10px]">
								{artistGuesser.user?.name?.[0]?.toUpperCase() ?? "?"}
							</AvatarFallback>
						</Avatar>
						<span className="font-medium">
							{artistGuesser.user?.name ?? "Unknown"}
						</span>
					</Badge>
				)}
				{titleGuesser && (
					<Badge variant="outline" className="gap-2 px-3 py-2">
						<TrophyIcon className="size-4 text-yellow-500" />
						<span className="text-muted-foreground">Title:</span>
						<Avatar className="size-5">
							<AvatarImage src={titleGuesser.user?.image ?? undefined} />
							<AvatarFallback className="text-[10px]">
								{titleGuesser.user?.name?.[0]?.toUpperCase() ?? "?"}
							</AvatarFallback>
						</Avatar>
						<span className="font-medium">
							{titleGuesser.user?.name ?? "Unknown"}
						</span>
					</Badge>
				)}
				{!artistGuesser && !titleGuesser && (
					<p className="text-muted-foreground text-sm">
						No one guessed correctly this round
					</p>
				)}
			</div>

			{/* Next round indicator */}
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<div className="size-2 animate-pulse rounded-full bg-primary" />
				<span>Next round starting soon...</span>
			</div>
		</div>
	);
}
