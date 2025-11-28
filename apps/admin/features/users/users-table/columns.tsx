import type { api } from "@repo/convex/_generated/api";
import type { ColumnDef } from "@tanstack/react-table";
import type { FunctionReturnType } from "convex/server";
import {
	UserTableActionsCell,
	UserTableCreatedAtCell,
	UserTableNameCell,
	UserTableSelectCell,
	UserTableSelectHeaderCell,
	UserTableStatusCell,
} from "./cells";

type User = FunctionReturnType<typeof api.queries.users.listUsers>[number];

export const userTableColumns: ColumnDef<User>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<UserTableSelectHeaderCell
				isAllPageRowsSelected={table.getIsAllPageRowsSelected()}
				isSomePageRowsSelected={table.getIsSomePageRowsSelected()}
				toggleAllPageRowsSelected={table.toggleAllPageRowsSelected}
			/>
		),
		cell: (context) => <UserTableSelectCell {...context} />,
	},
	{
		header: "Name",
		accessorKey: "name",
		cell: (context) => <UserTableNameCell {...context} />,
	},
	{
		header: "Email",
		accessorKey: "email",
	},
	{
		header: "Status",
		accessorKey: "isEmailVerified",
		cell: (context) => <UserTableStatusCell {...context} />,
	},
	{
		header: "Created At",
		accessorKey: "createdAt",
		cell: (context) => <UserTableCreatedAtCell {...context} />,
	},
	{
		id: "actions",
		meta: { className: "text-right" },
		cell: (context) => <UserTableActionsCell {...context} />,
	},
];
