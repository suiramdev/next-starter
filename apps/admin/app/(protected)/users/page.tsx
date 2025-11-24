import { MembersTable } from "@/features/members/components/members-table";

export default function UsersPage() {
	return (
		<section>
			<h1 className="mb-4 font-bold text-2xl">Users</h1>
			<MembersTable />
		</section>
	);
}
