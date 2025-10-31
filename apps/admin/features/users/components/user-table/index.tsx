"use client";

import { useState } from "react";
import { useZero, useQuery, type User } from "@repo/zero";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Button } from "@repo/ui/registry/admin/ui/button";
import { PlusIcon } from "@repo/ui/registry/admin/icons/plus";
import { AddUserDialog, AddUserDialogTrigger } from "../add-user-dialog";
import { userTableColumns } from "./columns";

export function UsersTable() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const z = useZero();
  const [users] = useQuery(z.query.user);

  const table = useReactTable({
    data: users,
    columns: userTableColumns,
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
      loading={!users}
      toolbar={
        <AddUserDialog>
          <AddUserDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon />
              Add User
            </Button>
          </AddUserDialogTrigger>
        </AddUserDialog>
      }
    />
  );
}
