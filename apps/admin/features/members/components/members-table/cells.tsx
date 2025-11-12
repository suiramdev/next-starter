import * as React from "react";
import Link from "next/link";
import { authClient } from "@repo/auth/helpers/react/client";
import { Checkbox } from "@repo/ui/registry/new-york-v4/ui/checkbox";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  TrashIcon,
  BanIcon,
} from "@repo/ui/registry/admin/icons";
import { BanUserDialog } from "../../../users/components/ban-user-dialog";
import { DeleteMemberDialog } from "../delete-member-dialog";
import type { CellContext } from "@tanstack/react-table";

// Extract the member type from listMembers return type
// Note: This works by inferring from the actual function signature
type ListMembersReturn = ReturnType<typeof authClient.organization.listMembers>;
type ListMembersData = Awaited<ListMembersReturn>["data"];
export type MemberFromList = NonNullable<ListMembersData>["members"][number];

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

export function MemberTableSelectCell({
  row,
}: CellContext<MemberFromList, unknown>) {
  return (
    <div className="flex items-center justify-start">
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={row.getToggleSelectedHandler()}
        aria-label={`Select member ${row.original?.user.name}`}
      />
    </div>
  );
}

export function MemberTableNameCell({
  row,
  getValue,
}: CellContext<MemberFromList, unknown>) {
  const name = getValue<string>();

  return (
    <Button
      asChild
      variant="link"
      className="w-fit px-0 text-left text-foreground"
    >
      <Link href={`/users/${row.original?.user.id}`}>{name}</Link>
    </Button>
  );
}

export function MemberTableStatusCell({
  getValue,
}: CellContext<MemberFromList, unknown>) {
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
}: CellContext<MemberFromList, unknown>) {
  const role = getValue<string | null>();
  return (
    <Badge variant="outline" className="capitalize">
      {role ?? ""}
    </Badge>
  );
}

export function MemberTableCreatedAtCell({
  getValue,
}: CellContext<MemberFromList, unknown>) {
  const timestamp = getValue<number>();
  return `${new Date(timestamp).toLocaleDateString()}`;
}

export function MemberTableActionsCell({
  row,
}: CellContext<MemberFromList, unknown>) {
  const [isBanDialogOpen, setIsBanDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { data: session } = authClient.useSession();

  const member = row.original;
  const isCurrentUser = member?.user.id === session?.user?.id;

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
      <BanUserDialog
        open={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        userId={member.user.id}
      />
      <DeleteMemberDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        memberIdOrEmail={member.id ?? member.user.email}
        organizationId={member.organizationId}
      />
    </>
  );
}
