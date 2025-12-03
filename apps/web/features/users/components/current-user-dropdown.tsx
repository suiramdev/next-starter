import { api } from "@repo/convex/_generated/api";
import { LogOutIcon } from "@repo/ui/registry/admin/icons";
import { authClient } from "@/lib/auth-client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { SpotifyIcon } from "@repo/ui/registry/web/icons";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";

export type CurrentUserDropdownProps = React.ComponentProps<
	typeof DropdownMenu
>;

export function CurrentUserDropdown({
	children,
	...props
}: CurrentUserDropdownProps) {
	const { data: session } = authClient.useSession();
	const router = useRouter();

	const hasSpotifyAccount = useQuery(api.domains.spotify.queries.hasSpotifyAccount);

	const handleSignOut = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};

	const handleUnlinkSpotify = () => {
		authClient.unlinkAccount({
			providerId: "spotify",
		});
	};

	const handleLinkSpotify = () => {
		authClient.linkSocial({
			provider: "spotify",
		});
	};

	return (
		<DropdownMenu {...props}>
			{children}
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel>
					<div className="flex items-center gap-2">
						<UserAvatar
							user={{
								image: session?.user?.image,
								name: session?.user?.name,
							}}
						/>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">
								{session?.user?.name ?? "Unknown"}
							</span>
							{session?.user?.email && (
								<span className="truncate text-muted-foreground text-xs">
									{session?.user?.email}
								</span>
							)}
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{hasSpotifyAccount ? (
					<DropdownMenuItem onClick={handleUnlinkSpotify} variant="destructive">
						<SpotifyIcon />
						Unlink from Spotify
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem onClick={handleLinkSpotify}>
						<SpotifyIcon />
						Link with Spotify
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOutIcon />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const CurrentUserDropdownTrigger = DropdownMenuTrigger;
