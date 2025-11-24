"use client";

import { convexQuery } from "@convex-dev/react-query";
import { api } from "@repo/convex/_generated/api";
import { PlusIcon } from "@repo/ui/registry/admin/icons";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { memberTableColumns } from "./columns";

type MembersTableProps = {
	organizationId?: string;
};

export function MembersTable({ organizationId }: MembersTableProps) {
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const { data: activeMember } = useQuery(
		convexQuery(api.queries.organizations.getActiveMember),
	);

	const { data: listMembers, isLoading: isLoadingListMembers } = useQuery(
		convexQuery(api.queries.organizations.listMembers, {
			query: {
				organizationId: organizationId ?? activeMember?.organizationId ?? "",
			},
		}),
	);

	const members = listMembers?.members ?? [];

	const table = useReactTable({
		data: members,
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
			toolbar={
				<Button variant="outline" size="sm">
					<PlusIcon />
					Add Member
				</Button>
			}
			loading={isLoadingListMembers}
		/>
	);
}
