import { authClient } from "@repo/auth/helpers/react/client";
import { LogOutIcon } from "@repo/ui/registry/admin/icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";

export type CurrentUserDropdownProps = React.ComponentProps<
	typeof DropdownMenu
>;

export function CurrentUserDropdown({
	children,
	...props
}: CurrentUserDropdownProps) {
	const router = useRouter();

	const handleSignOut = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
	};
	const { data: session } = authClient.useSession();
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
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOutIcon />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const CurrentUserDropdownTrigger = DropdownMenuTrigger;
