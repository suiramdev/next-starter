import { UsersTable } from "@/features/users/components/users-table";

export default function Users() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable />
    </section>
  );
}
