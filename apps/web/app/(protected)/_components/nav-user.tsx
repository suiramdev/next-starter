"use client";

import { authClient } from "@repo/convex/helpers/next/auth-client";
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import {
	CurrentUserDropdown,
	CurrentUserDropdownTrigger,
} from "@/features/users/components/current-user-dropdown";
import { UserAvatar } from "@/features/users/components/user-avatar";

export function NavUser() {
	const { data: session } = authClient.useSession();

	if (!session) return <NavUserSkeleton />;

	return (
		<CurrentUserDropdown>
			<CurrentUserDropdownTrigger>
				<UserAvatar
					user={{
						image: session.user.image,
						name: session.user.name,
					}}
					className="size-10 rounded-full"
				/>
			</CurrentUserDropdownTrigger>
		</CurrentUserDropdown>
	);
}

export function NavUserSkeleton() {
	return <Skeleton className="size-10 rounded-full" />;
}
