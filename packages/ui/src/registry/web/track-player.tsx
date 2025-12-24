"use client";

import { AudioProgressBar } from "@repo/ui/registry/web/audio-progress-bar";
import { useEffect, useRef, useState } from "react";

interface TrackPlayerProps {
	previewUrl: string;
	isPlaying: boolean;
}

export function TrackPlayer({ previewUrl, isPlaying }: TrackPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioProgress, setAudioProgress] = useState(0);

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

		const handleEnded = () => {
			setAudioProgress(0);
		};

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	return (
		<div className="relative flex flex-col gap-4">
			{/* Audio element (hidden) - no captions needed for music guessing game */}
			{/* biome-ignore lint/a11y/useMediaCaption: Music preview for guessing game */}
			<audio ref={audioRef} src={previewUrl} preload="auto" />

			<AudioProgressBar progress={audioProgress} />
		</div>
	);
}



