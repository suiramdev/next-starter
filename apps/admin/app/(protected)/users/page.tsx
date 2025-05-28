import { UsersTable } from "@/features/users/users-table";

const users = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    image: undefined,
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob@example.com",
    image: undefined,
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    image: undefined,
  },
];

export default function Users() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable users={users} />
    </section>
  );
}
