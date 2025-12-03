import type { api } from "@repo/convex/_generated/api";
import { cn } from "@repo/ui/lib/utils";
import { authClient } from "@/lib/auth-client";
import { BanIcon, MoreHorizontalIcon } from "@repo/ui/registry/admin/icons";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Checkbox } from "@repo/ui/registry/new-york-v4/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import type { CellContext } from "@tanstack/react-table";
import type { FunctionReturnType } from "convex/server";
import Link from "next/link";
import * as React from "react";
import { BanUserDialog } from "../components/ban-user-dialog";

type User = FunctionReturnType<typeof api.domains.users.queries.listUsers>[number];

export function UserTableSelectHeaderCell({
	isAllPageRowsSelected,
	isSomePageRowsSelected,
	toggleAllPageRowsSelected,
}: {
	isAllPageRowsSelected: boolean;
	isSomePageRowsSelected: boolean;
	toggleAllPageRowsSelected: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-start">
			<Checkbox
				checked={
					isAllPageRowsSelected || (isSomePageRowsSelected && "indeterminate")
				}
				onCheckedChange={(value) => toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		</div>
	);
}

export function UserTableSelectCell({ row }: CellContext<User, unknown>) {
	return (
		<div className="flex items-center justify-start">
			<Checkbox
				checked={row.getIsSelected()}
				disabled={!row.getCanSelect()}
				onCheckedChange={row.getToggleSelectedHandler()}
				aria-label={`Select user ${row.original?.name ?? ""}`}
			/>
		</div>
	);
}

export function UserTableNameCell({
	row,
	getValue,
}: CellContext<User, unknown>) {
	const name = getValue<string | null>();

	return (
		<Button
			asChild
			variant="link"
			className="w-fit px-0 text-left text-foreground"
		>
			<Link href={`/users/${row.original?._id}`}>{name ?? "Anonymous"}</Link>
		</Button>
	);
}

export function UserTableStatusCell({ getValue }: CellContext<User, unknown>) {
	const isEmailVerified = getValue<boolean>();
	const color = isEmailVerified
		? "bg-muted text-muted-foreground"
		: "bg-destructive text-destructive-foreground";

	return (
		<Badge variant="secondary" className={cn("capitalize", color)}>
			{isEmailVerified ? "Verified" : "Unverified"}
		</Badge>
	);
}

export function UserTableCreatedAtCell({
	getValue,
}: CellContext<User, unknown>) {
	const timestamp = getValue<number>();
	return `${new Date(timestamp).toLocaleDateString()}`;
}

export function UserTableActionsCell({ row }: CellContext<User, unknown>) {
	const [isBanDialogOpen, setIsBanDialogOpen] = React.useState(false);
	const { data: session } = authClient.useSession();

	const user = row.original;
	const isCurrentUser = user?._id === session?.user?.id;

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						variant="destructive"
						className={
							isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"
						}
						onClick={() => !isCurrentUser && setIsBanDialogOpen(true)}
						disabled={isCurrentUser}
					>
						<BanIcon className="mr-2 h-4 w-4" />
						Ban
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{user._id && (
				<BanUserDialog
					open={isBanDialogOpen}
					onOpenChange={setIsBanDialogOpen}
					userId={user._id}
				/>
			)}
		</>
	);
}
