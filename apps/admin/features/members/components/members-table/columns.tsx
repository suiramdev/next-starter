import type { api } from "@repo/convex/_generated/api";
import type { ColumnDef } from "@tanstack/react-table";
import type { FunctionReturnType } from "convex/server";
import {
	MemberTableActionsCell,
	MemberTableCreatedAtCell,
	MemberTableNameCell,
	MemberTableRoleCell,
	MemberTableSelectCell,
	MemberTableSelectHeaderCell,
	MemberTableStatusCell,
} from "./cells";

type Member = FunctionReturnType<
	typeof api.queries.organizations.listMembers
>["members"][number];

export const memberTableColumns: ColumnDef<Member>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<MemberTableSelectHeaderCell
				isAllPageRowsSelected={table.getIsAllPageRowsSelected()}
				isSomePageRowsSelected={table.getIsSomePageRowsSelected()}
				toggleAllPageRowsSelected={table.toggleAllPageRowsSelected}
			/>
		),
		cell: (context) => <MemberTableSelectCell {...context} />,
	},
	{
		header: "Name",
		accessorKey: "user.name",
		cell: (context) => <MemberTableNameCell {...context} />,
	},
	{
		header: "Email",
		accessorKey: "user.email",
	},
	{
		header: "Status",
		accessorKey: "user.emailVerified",
		cell: (context) => <MemberTableStatusCell {...context} />,
	},
	{
		header: "Role",
		accessorKey: "role",
		cell: (context) => <MemberTableRoleCell {...context} />,
	},
	{
		header: "Created At",
		accessorKey: "createdAt",
		cell: (context) => <MemberTableCreatedAtCell {...context} />,
	},
	{
		id: "actions",
		meta: { className: "text-right" },
		cell: (context) => <MemberTableActionsCell {...context} />,
	},
];
