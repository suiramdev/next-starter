"use client";

import type { api } from "@repo/convex/_generated/api";
import { PlusIcon } from "@repo/ui/registry/admin/icons";
import { ControlledTable } from "@repo/ui/registry/admin/ui/controlled-table";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useState } from "react";
import { userTableColumns } from "./columns";

type UsersTableProps = {
	preloadedQuery: Preloaded<typeof api.domains.users.queries.listUsers>;
};

export function UsersTable({ preloadedQuery }: UsersTableProps) {
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const users = usePreloadedQuery(preloadedQuery);

	const table = useReactTable({
		data: users,
		columns: userTableColumns,
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
				<Button variant="outline" size="sm">
					<PlusIcon />
					Add Member
				</Button>
			}
		/>
	);
}
