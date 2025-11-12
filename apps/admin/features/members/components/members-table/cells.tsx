import { authClient } from "@repo/auth/helpers/react/client";
import type { components } from "@repo/convex/_generated/api";
import { cn } from "@repo/ui/lib/utils";
import {
	BanIcon,
	MoreHorizontalIcon,
	TrashIcon,
} from "@repo/ui/registry/admin/icons";
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
import { BanUserDialog } from "../../../users/components/ban-user-dialog";
import { DeleteMemberDialog } from "../delete-member-dialog";

type Member = FunctionReturnType<
	typeof components.betterAuth.queries.organizations.getOrganizationMembers
>[number];

export function MemberTableSelectHeaderCell({
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

export function MemberTableSelectCell({ row }: CellContext<Member, unknown>) {
	return (
		<div className="flex items-center justify-start">
			<Checkbox
				checked={row.getIsSelected()}
				disabled={!row.getCanSelect()}
				onCheckedChange={row.getToggleSelectedHandler()}
				aria-label={`Select member ${row.original?.user?.name ?? ""}`}
			/>
		</div>
	);
}

export function MemberTableNameCell({
	row,
	getValue,
}: CellContext<Member, unknown>) {
	const name = getValue<string | null>();

	return (
		<Button
			asChild
			variant="link"
			className="w-fit px-0 text-left text-foreground"
		>
			<Link href={`/users/${row.original?.userId}`}>{name ?? "Anonymous"}</Link>
		</Button>
	);
}

export function MemberTableStatusCell({
	getValue,
}: CellContext<Member, unknown>) {
	const isEmailVerified = getValue<boolean>();
	const color = isEmailVerified
		? "bg-blue-500 text-white dark:bg-blue-600"
		: "bg-gray-500 text-white dark:bg-gray-600";

	return (
		<Badge variant="secondary" className={cn("capitalize", color)}>
			{isEmailVerified ? "Verified" : "Unverified"}
		</Badge>
	);
}

export function MemberTableRoleCell({
	getValue,
}: CellContext<Member, unknown>) {
	const role = getValue<string | null>();
	return (
		<Badge variant="outline" className="capitalize">
			{role ?? ""}
		</Badge>
	);
}

export function MemberTableCreatedAtCell({
	getValue,
}: CellContext<Member, unknown>) {
	const timestamp = getValue<number>();
	return `${new Date(timestamp).toLocaleDateString()}`;
}

export function MemberTableActionsCell({ row }: CellContext<Member, unknown>) {
	const [isBanDialogOpen, setIsBanDialogOpen] = React.useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const { data: session } = authClient.useSession();

	const member = row.original;
	const isCurrentUser = member?.userId === session?.user?.id;

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
					<DropdownMenuItem
						variant="destructive"
						className={
							isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"
						}
						onClick={() => !isCurrentUser && setIsDeleteDialogOpen(true)}
						disabled={isCurrentUser}
					>
						<TrashIcon className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{member.user?.userId && (
				<BanUserDialog
					open={isBanDialogOpen}
					onOpenChange={setIsBanDialogOpen}
					userId={member.user?.userId}
				/>
			)}
			<DeleteMemberDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				memberIdOrEmail={member._id}
				organizationId={member.organizationId}
			/>
		</>
	);
}
