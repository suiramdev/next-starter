import { ColumnDef } from "@tanstack/react-table";
import type { User } from "@repo/zero";
import {
  UserTableActionsCell,
  UserTableCreatedAtCell,
  UserTableNameCell,
  UserTableRoleCell,
  UserTableSelectCell,
  UserTableSelectHeaderCell,
  UserTableStatusCell,
} from "./cells";

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
    accessorKey: "emailVerified",
    cell: (context) => <UserTableStatusCell {...context} />,
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: (context) => <UserTableRoleCell {...context} />,
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
