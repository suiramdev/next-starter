import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/registry/new-york-v4/ui/avatar";

type UserAvatarProps = React.ComponentProps<typeof Avatar> & {
  user: {
    image?: string | null;
    name?: string | null;
  };
};

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.image ?? undefined} alt={user.name ?? undefined} />
      <AvatarFallback>
        {user.name?.charAt(0).toUpperCase()}
        {user.name?.charAt(1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
