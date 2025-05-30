"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@repo/auth/helpers/react/client";
import { User } from "@repo/auth";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { Checkbox } from "@repo/ui/registry/new-york-v4/ui/checkbox";
import { Button } from "@repo/ui/registry/admin/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { MoreHorizontalIcon } from "@repo/ui/registry/admin/icons/more-horizontal";
import { PencilIcon } from "@repo/ui/registry/admin/icons/pencil";
import { TrashIcon } from "@repo/ui/registry/admin/icons/trash";
import Link from "next/link";
import { PlusIcon } from "@repo/ui/registry/admin/icons/plus";
import { Badge } from "@repo/ui/registry/new-york-v4/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { AddUserDialog, AddUserDialogTrigger } from "./add-user-dialog";

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-start">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={row.getToggleSelectedHandler()}
          aria-label={`Select user ${row.original.name}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row, getValue }) => (
      <Button
        asChild
        variant="link"
        className="w-fit px-0 text-left text-foreground"
      >
        <Link href={`/users/${row.original.id}`}>{getValue() as string}</Link>
      </Button>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Status",
    accessorKey: "email_verifier",
    cell: ({ getValue }) => {
      const isEmailVerified = getValue() as boolean;
      const color = isEmailVerified ? "bg-blue-500 text-white dark:bg-blue-600" : "bg-gray-500 text-white dark:bg-gray-600";

      return (
        <Badge variant="secondary" className={cn("capitalize", color)}>
          {isEmailVerified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="capitalize">
        {getValue() as string}
      </Badge>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ getValue }) =>
      `${new Date(getValue() as string).toLocaleDateString()}`,
  },
  {
    id: "actions",
    meta: { className: "text-right" },
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/users/${user.id}`} className="cursor-pointer">
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersTable() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await authClient.admin.listUsers({
        query: {
          limit: 10,
        },
      });

      return data?.users ?? [];
    },
  });

  const table = useReactTable({
    data: users ?? [],
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ControlledTable
      table={table}
      loading={isLoading}
      toolbar={(
        <AddUserDialog>
          <AddUserDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon />
              Add User
            </Button>
          </AddUserDialogTrigger>
        </AddUserDialog>
      )}
    />
  );
}
