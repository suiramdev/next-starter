"use client";

import { useState } from "react";
import { useQuery } from "@repo/zero/helpers/react";
import { getUsers } from "@repo/zero/queries";
import { authClient } from "@repo/auth/helpers/react/client";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { PlusIcon } from "@repo/ui/registry/admin/icons";
import { AddUserDialog, AddUserDialogTrigger } from "../add-user-dialog";
import { userTableColumns } from "./columns";

export function UsersTable() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { data: session } = authClient.useSession();
  const [users] = useQuery(getUsers({ userId: session?.user?.id ?? "anon" }));

  const table = useReactTable({
    data: users ?? [],
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
