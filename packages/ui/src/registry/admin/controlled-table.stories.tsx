import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "#src/registry/new-york-v4/ui/badge";
import { Button } from "#src/registry/new-york-v4/ui/button";
import { Checkbox } from "#src/registry/new-york-v4/ui/checkbox";
import {
	ControlledTable,
	ControlledTableColumnsVisibility,
	ControlledTableControls,
	ControlledTableToolbar,
} from "./controlled-table";
import { PlusIcon } from "./icons";

// Mock data types
type User = {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user" | "moderator";
	status: "active" | "inactive" | "pending";
	createdAt: string;
};

// Mock data
const mockUsers: User[] = [
	{
		id: "1",
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "admin",
		status: "active",
		createdAt: "2024-01-15",
	},
	{
		id: "2",
		name: "Bob Smith",
		email: "bob@example.com",
		role: "user",
		status: "active",
		createdAt: "2024-02-20",
	},
	{
		id: "3",
		name: "Carol Williams",
		email: "carol@example.com",
		role: "moderator",
		status: "pending",
		createdAt: "2024-03-10",
	},
	{
		id: "4",
		name: "David Brown",
		email: "david@example.com",
		role: "user",
		status: "inactive",
		createdAt: "2024-03-25",
	},
	{
		id: "5",
		name: "Eve Davis",
		email: "eve@example.com",
		role: "user",
		status: "active",
		createdAt: "2024-04-05",
	},
	{
		id: "6",
		name: "Frank Miller",
		email: "frank@example.com",
		role: "admin",
		status: "active",
		createdAt: "2024-04-12",
	},
	{
		id: "7",
		name: "Grace Wilson",
		email: "grace@example.com",
		role: "user",
		status: "pending",
		createdAt: "2024-05-01",
	},
	{
		id: "8",
		name: "Henry Taylor",
		email: "henry@example.com",
		role: "moderator",
		status: "active",
		createdAt: "2024-05-18",
	},
	{
		id: "9",
		name: "Ivy Anderson",
		email: "ivy@example.com",
		role: "user",
		status: "inactive",
		createdAt: "2024-06-02",
	},
	{
		id: "10",
		name: "Jack Thomas",
		email: "jack@example.com",
		role: "user",
		status: "active",
		createdAt: "2024-06-15",
	},
	{
		id: "11",
		name: "Karen Martinez",
		email: "karen@example.com",
		role: "admin",
		status: "active",
		createdAt: "2024-07-01",
	},
	{
		id: "12",
		name: "Leo Garcia",
		email: "leo@example.com",
		role: "user",
		status: "pending",
		createdAt: "2024-07-20",
	},
];

// Column definitions
const columns: ColumnDef<User>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		header: "Name",
		accessorKey: "name",
	},
	{
		header: "Email",
		accessorKey: "email",
	},
	{
		header: "Role",
		accessorKey: "role",
		cell: ({ row }) => {
			const role = row.getValue("role") as string;
			return (
				<Badge
					variant={
						role === "admin"
							? "default"
							: role === "moderator"
								? "secondary"
								: "outline"
					}
				>
					{role}
				</Badge>
			);
		},
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<Badge
					variant={
						status === "active"
							? "default"
							: status === "pending"
								? "secondary"
								: "destructive"
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		header: "Created At",
		accessorKey: "createdAt",
	},
	{
		id: "actions",
		meta: { className: "text-right" },
		cell: () => (
			<Button variant="ghost" size="sm">
				Edit
			</Button>
		),
	},
];

// Wrapper component for stories
function ControlledTableWrapper({
	data = mockUsers,
	loading = false,
	hideToolbar = false,
	hideControls = false,
	withCustomToolbar = false,
}: {
	data?: User[];
	loading?: boolean;
	hideToolbar?: boolean;
	hideControls?: boolean;
	withCustomToolbar?: boolean;
}) {
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 5,
			},
		},
	});

	return (
		<ControlledTable
			table={table}
			loading={loading}
			hideToolbar={hideToolbar}
			hideControls={hideControls}
			toolbar={
				withCustomToolbar ? (
					<Button variant="outline" size="sm">
						<PlusIcon />
						Add User
					</Button>
				) : undefined
			}
		/>
	);
}

/**
 * A controlled table component built on TanStack Table with built-in toolbar,
 * pagination, column visibility controls, and loading states.
 */
const meta = {
	title: "Admin/ControlledTable",
	component: ControlledTable,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-5xl">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ControlledTable>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default table with all features enabled: toolbar, pagination,
 * column visibility, and row selection.
 */
export const Default: Story = {
	render: () => <ControlledTableWrapper />,
};

/**
 * Table in a loading state, displaying skeleton rows while data is being fetched.
 */
export const Loading: Story = {
	render: () => <ControlledTableWrapper loading />,
};

/**
 * Table with no data, showing an empty state message.
 */
export const Empty: Story = {
	render: () => <ControlledTableWrapper data={[]} />,
};

/**
 * Table with a custom toolbar action button alongside the default column visibility control.
 */
export const WithCustomToolbar: Story = {
	render: () => <ControlledTableWrapper withCustomToolbar />,
};

/**
 * Table without the toolbar, useful when column visibility controls aren't needed.
 */
export const WithoutToolbar: Story = {
	render: () => <ControlledTableWrapper hideToolbar />,
};

/**
 * Table without pagination and selection summary controls.
 */
export const WithoutControls: Story = {
	render: () => <ControlledTableWrapper hideControls />,
};

/**
 * Minimal table without toolbar or controls, showing just the data table.
 */
export const Minimal: Story = {
	render: () => <ControlledTableWrapper hideToolbar hideControls />,
};

// Stories for individual sub-components

/**
 * The toolbar component with column visibility dropdown.
 */
export const ToolbarOnly: Story = {
	render: () => {
		function ToolbarDemo() {
			const table = useReactTable({
				data: mockUsers.slice(0, 3),
				columns,
				getCoreRowModel: getCoreRowModel(),
			});

			return (
				<ControlledTableToolbar table={table}>
					<Button variant="outline" size="sm">
						<PlusIcon />
						Add User
					</Button>
				</ControlledTableToolbar>
			);
		}
		return <ToolbarDemo />;
	},
};

/**
 * The pagination and selection summary controls.
 */
export const ControlsOnly: Story = {
	render: () => {
		function ControlsDemo() {
			const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
				{
					"1": true,
					"3": true,
				},
			);

			const table = useReactTable({
				data: mockUsers,
				columns,
				state: {
					rowSelection,
				},
				enableRowSelection: true,
				onRowSelectionChange: setRowSelection,
				getRowId: (row) => row.id,
				getCoreRowModel: getCoreRowModel(),
				getPaginationRowModel: getPaginationRowModel(),
				initialState: {
					pagination: {
						pageSize: 5,
					},
				},
			});

			return <ControlledTableControls table={table} />;
		}
		return <ControlsDemo />;
	},
};

/**
 * The column visibility dropdown as a standalone component.
 */
export const ColumnsVisibilityOnly: Story = {
	render: () => {
		function ColumnsVisibilityDemo() {
			const table = useReactTable({
				data: mockUsers.slice(0, 3),
				columns,
				getCoreRowModel: getCoreRowModel(),
			});

			return <ControlledTableColumnsVisibility table={table} />;
		}
		return <ColumnsVisibilityDemo />;
	},
};
