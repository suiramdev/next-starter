import * as React from "react";
import Link from "next/link";
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
  PencilIcon,
  TrashIcon,
  BanIcon,
} from "@repo/ui/registry/admin/icons";
import { BanUserDialog } from "../ban-user-dialog";
import { DeleteUserDialog } from "../delete-user-dialog";
import { EditUserDialog } from "../edit-user-dialog";
import { authClient } from "@repo/auth/helpers/react/client";
import type { User } from "@repo/db/zero";
import type { CellContext } from "@tanstack/react-table";

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
        aria-label={`Select user ${row.original.name}`}
      />
    </div>
  );
}

export function UserTableNameCell({
  row,
  getValue,
}: CellContext<User, unknown>) {
  const name = getValue<string>();
  return (
    <Button
      asChild
      variant="link"
      className="w-fit px-0 text-left text-foreground"
    >
      <Link href={`/users/${row.original.id}`}>{name}</Link>
    </Button>
  );
}

export function UserTableStatusCell({ getValue }: CellContext<User, unknown>) {
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

export function UserTableRoleCell({ getValue }: CellContext<User, unknown>) {
  const role = getValue<string | null>();
  return (
    <Badge variant="outline" className="capitalize">
      {role ?? ""}
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { data: session } = authClient.useSession();

  const user = row.original;
  const isCurrentUser = user.id === session?.user?.id;

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
            className="cursor-pointer"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className={isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            onClick={() => !isCurrentUser && setIsBanDialogOpen(true)}
            disabled={isCurrentUser}
          >
            <BanIcon className="mr-2 h-4 w-4" />
            Ban
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className={isCurrentUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            onClick={() => !isCurrentUser && setIsDeleteDialogOpen(true)}
            disabled={isCurrentUser}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
      />
      <BanUserDialog
        open={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        userId={user.id}
      />
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userId={user.id}
      />
    </>
  );
}
