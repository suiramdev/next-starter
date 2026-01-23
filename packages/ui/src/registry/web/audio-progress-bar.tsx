import { cn } from "#src/lib/utils";

interface AudioProgressBarProps {
	progress: number;
	className?: string;
	size?: number;
	strokeWidth?: number;
}

function AudioProgressBar({
	progress,
	className,
	size = 64,
	strokeWidth = 4,
}: AudioProgressBarProps) {
	// Calculate the circumference of the circle
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	// Calculate the offset to show progress (starting from top, going clockwise)
	// We need to offset by the progress percentage, and start from top (rotate -90deg)
	const offset = circumference - (progress / 100) * circumference;

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<svg
				width={size}
				height={size}
				className="-rotate-90 transform"
				role="img"
				aria-label={`${progress}% progress`}
			>
				<title>{`${progress}% progress`}</title>
				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
					fill="none"
					className="text-muted"
				/>
				{/* Progress circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="text-primary transition-all duration-200"
				/>
			</svg>
		</div>
	);
}

export { AudioProgressBar };
