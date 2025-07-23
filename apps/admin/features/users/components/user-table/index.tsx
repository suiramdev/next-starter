"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@repo/auth/helpers/react/client";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Button } from "@repo/ui/registry/admin/ui/button";
import { PlusIcon } from "@repo/ui/registry/admin/icons/plus";
import { AddUserDialog, AddUserDialogTrigger } from "../add-user-dialog";
import { userTableColumns } from "./columns";

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
      loading={isLoading}
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
