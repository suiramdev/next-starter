"use client";

import { api } from "@repo/convex/_generated/api";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/registry/new-york-v4/ui/breadcrumb";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BreadcrumbSlot() {
	const { id } = useParams<{ id: string }>();

	const user = useQuery(api.queries.users.getUser, {
		userId: id,
	});

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
