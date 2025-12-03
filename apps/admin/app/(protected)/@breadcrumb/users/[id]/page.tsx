import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import { createAuth } from "@repo/convex/domains/auth/setup";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/registry/new-york-v4/ui/breadcrumb";
import Link from "next/link";
import { convexClient } from "@/lib/convex-server";

type BreadcrumbSlotProps = {
	params: Promise<{ id: string }>;
};

export default async function BreadcrumbSlot({ params }: BreadcrumbSlotProps) {
	const { id } = await params;
	const token = await getToken(createAuth);

	let user = null;
	if (token) {
		convexClient.setAuth(token);

		user = await convexClient.query(api.domains.users.queries.getUser, {
			userId: id,
		});
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/users">Users</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{user?.name ?? id}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
