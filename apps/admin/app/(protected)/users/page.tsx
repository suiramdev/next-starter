import { api } from "@repo/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { UsersTable } from "@/features/users/components/users-table";

export default async function UsersPage() {
	const listUsersQuery = await preloadQuery(
		api.domains.users.queries.listUsers,
	);

	return (
		<section>
			<h1 className="mb-4 font-bold text-2xl">Users</h1>
			<UsersTable preloadedQuery={listUsersQuery} />
		</section>
	);
}
