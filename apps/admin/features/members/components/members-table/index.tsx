"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { authClient } from "@repo/auth/helpers/react/client";
import { api } from "@repo/convex/_generated/api";
import { memberTableColumns } from "./columns";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { PlusIcon } from "@repo/ui/registry/admin/icons";
import { AddMemberDialog, AddMemberDialogTrigger } from "../add-member-dialog";

type MembersTableProps = {
  organizationId?: string;
};

export function MembersTable({ organizationId }: MembersTableProps) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const members = useQuery(api.queries.organizations.getOrganizationMembers, {
    organizationId: organizationId ?? activeOrganization?.id ?? "",
  });

  const table = useReactTable({
    data: members ?? [],
    columns: memberTableColumns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row._id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ControlledTable
      table={table}
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
