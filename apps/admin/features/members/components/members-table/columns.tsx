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
import { components } from "@repo/convex/_generated/api";
import { FunctionReturnType } from "convex/server";

type Member = FunctionReturnType<
  typeof components.betterAuth.queries.organizations.getOrganizationMembers
>[number];

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
