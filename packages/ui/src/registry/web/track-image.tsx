import Image from "next/image";
import { cn } from "#src/lib/utils";
import { DiscIcon } from "#src/registry/web/icons";

interface TrackImageProps {
	src?: string;
	alt?: string;
	className?: string;
	fallbackClassName?: string;
	iconClassName?: string;
	fill?: boolean;
	width?: number;
	height?: number;
}

export function TrackImage({
	src,
	alt = "Track cover",
	className,
	fallbackClassName,
	iconClassName,
	fill = false,
	width,
	height,
}: TrackImageProps) {
	if (src) {
		return (
			<Image
				src={src}
				alt={alt}
				className={cn("object-cover", className)}
				fill={fill}
				width={width}
				height={height}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center bg-primary/20",
				className,
				fallbackClassName,
			)}
		>
			<DiscIcon className={cn("size-6 text-muted-foreground", iconClassName)} />
		</div>
	);
}
