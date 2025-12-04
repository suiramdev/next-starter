"use client";

import { cn } from "@repo/ui/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { SpotifyIcon } from "@repo/ui/registry/web/icons";

export function LinkSpotifyButton({
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	const handleLinkSpotify = async () => {
		await authClient.linkSocial({
			provider: "spotify",
		});
	};

	return (
		<Button
			{...props}
			type="button"
			onClick={handleLinkSpotify}
			className={cn("bg-[#1DB954] text-white hover:bg-[#1ed760]", className)}
		>
			<SpotifyIcon className="size-4" />
			Link with Spotify
		</Button>
	);
}
