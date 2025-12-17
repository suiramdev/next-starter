"use client";

import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { AudioProgressBar } from "@repo/ui/registry/web/audio-progress-bar";
import { CheckCircleIcon } from "@repo/ui/registry/web/icons";
import { MusicVisualizer } from "@repo/ui/registry/web/music-visualizer";
import { useEffect, useRef, useState } from "react";

interface TrackPlayerProps {
	previewUrl: string;
	isPlaying: boolean;
	userGuessedArtist: boolean;
	userGuessedTitle: boolean;
	revealedArtist?: string;
	revealedTitle?: string;
}

export function TrackPlayer({
	previewUrl,
	isPlaying,
	userGuessedArtist,
	userGuessedTitle,
	revealedArtist,
	revealedTitle,
}: TrackPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioProgress, setAudioProgress] = useState(0);
	const [isAudioPlaying, setIsAudioPlaying] = useState(false);

	// Auto-play when isPlaying becomes true
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.play().catch(console.error);
		} else {
			audio.pause();
		}
	}, [isPlaying]);

	// Track audio progress
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => {
			const progress = (audio.currentTime / audio.duration) * 100;
			setAudioProgress(Number.isNaN(progress) ? 0 : progress);
		};

		const handlePlay = () => setIsAudioPlaying(true);
		const handlePause = () => setIsAudioPlaying(false);
		const handleEnded = () => {
			setIsAudioPlaying(false);
			setAudioProgress(0);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	return (
		<div className="relative flex flex-col gap-4 rounded-xl border bg-linear-to-br from-card to-card/50 p-6">
			{/* Audio element (hidden) - no captions needed for music guessing game */}
			{/* biome-ignore lint/a11y/useMediaCaption: Music preview for guessing game */}
			<audio ref={audioRef} src={previewUrl} preload="auto" />

			<MusicVisualizer isPlaying={isAudioPlaying} />

			<AudioProgressBar progress={audioProgress} />

			{/* Your guesses - only YOU see what you've found */}
			<div className="flex flex-wrap items-center justify-center gap-2">
				{userGuessedArtist && revealedArtist && (
					<Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
						<CheckCircleIcon className="size-4 text-green-500" />
						<span className="font-medium">{revealedArtist}</span>
					</Badge>
				)}
				{userGuessedTitle && revealedTitle && (
					<Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
						<CheckCircleIcon className="size-4 text-green-500" />
						<span className="font-medium">{revealedTitle}</span>
					</Badge>
				)}
				{userGuessedArtist && userGuessedTitle ? (
					<p className="text-green-600 text-sm dark:text-green-400">
						🎉 You got both! Wait for the round to end...
					</p>
				) : !userGuessedArtist && !userGuessedTitle ? (
					<p className="text-muted-foreground text-sm">
						Guess the track title or artist!
					</p>
				) : (
					<p className="text-muted-foreground text-sm">
						Keep guessing for the {!userGuessedArtist ? "artist" : "title"}!
					</p>
				)}
			</div>
		</div>
	);
}
