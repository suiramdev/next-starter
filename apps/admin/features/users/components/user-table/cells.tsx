import * as React from "react";
import { Checkbox } from "@repo/ui/registry/new-york-v4/ui/checkbox";
import { Button } from "@repo/ui/registry/admin/ui/button";
import Link from "next/link";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { MoreHorizontalIcon } from "@repo/ui/registry/admin/icons/more-horizontal";
import { PencilIcon } from "@repo/ui/registry/admin/icons/pencil";
import { TrashIcon } from "@repo/ui/registry/admin/icons/trash";
import { BanIcon } from "@repo/ui/registry/admin/icons/ban";
import { BanUserDialog } from "../ban-user-dialog";
import { DeleteUserDialog } from "../delete-user-dialog";
import type { User } from "@repo/auth";
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
  return (
    <Button
      asChild
      variant="link"
      className="w-fit px-0 text-left text-foreground"
    >
      <Link href={`/users/${row.original.id}`}>{getValue() as string}</Link>
    </Button>
  );
}

export function UserTableStatusCell({ getValue }: CellContext<User, unknown>) {
  const isEmailVerified = getValue() as boolean;
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
  return (
    <Badge variant="outline" className="capitalize">
      {getValue() as string}
    </Badge>
  );
}

export function UserTableCreatedAtCell({
  getValue,
}: CellContext<User, unknown>) {
  return `${new Date(getValue() as string).toLocaleDateString()}`;
}

export function UserTableActionsCell({ row }: CellContext<User, unknown>) {
  const [isBanDialogOpen, setIsBanDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const user = row.original;

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
          <DropdownMenuItem asChild>
            <Link href={`/users/${user.id}`} className="cursor-pointer">
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setIsBanDialogOpen(true)}
          >
            <BanIcon className="mr-2 h-4 w-4" />
            Ban
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BanUserDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen} />
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
