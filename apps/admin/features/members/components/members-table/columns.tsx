import { ColumnDef } from "@tanstack/react-table";
import {
  MemberTableActionsCell,
  MemberTableCreatedAtCell,
  MemberTableNameCell,
  MemberTableRoleCell,
  MemberTableSelectCell,
  MemberTableSelectHeaderCell,
  MemberTableStatusCell,
} from "./cells";
import type { MemberFromList } from "./cells";

export const memberTableColumns: ColumnDef<MemberFromList>[] = [
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
    accessorKey: "user.role",
    cell: (context) => <MemberTableRoleCell {...context} />,
  },
  {
    header: "Created At",
    accessorKey: "user.createdAt",
    cell: (context) => <MemberTableCreatedAtCell {...context} />,
  },
  {
    id: "actions",
    meta: { className: "text-right" },
    cell: (context) => <MemberTableActionsCell {...context} />,
  },
];
