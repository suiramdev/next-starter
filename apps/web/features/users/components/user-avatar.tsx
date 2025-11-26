import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";

interface UserAvatarProps {
	name?: string | null;
	image?: string | null;
	className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
	const initials =
		name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) ?? "U";

	return (
		<Avatar className={className}>
			<AvatarImage src={image ?? undefined} alt={name ?? "User"} />
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	);
}
