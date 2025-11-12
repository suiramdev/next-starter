"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { authClient } from "@repo/auth/helpers/react/client";
import { memberTableColumns } from "./columns";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { PlusIcon } from "@repo/ui/registry/admin/icons";
import { AddMemberDialog, AddMemberDialogTrigger } from "../add-member-dialog";

export function MembersTable() {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  // FIXME: Prefer fetching the organization by a given organization id
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const table = useReactTable({
    data: activeOrganization?.members ?? [],
    // FIXME: MemberFromList is not properly inferred in the columns definition
    columns: memberTableColumns,
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
      loading={!activeOrganization?.members}
      toolbar={
        <AddMemberDialog>
          <AddMemberDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusIcon />
              Add Member
            </Button>
          </AddMemberDialogTrigger>
        </AddMemberDialog>
      }
    />
  );
}
