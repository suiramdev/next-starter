import { getToken } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@repo/convex/domains/auth/setup";
import { redirect } from "next/navigation";
import { convexClient } from "@/lib/convex-server";

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const token = await getToken(createAuth);

	if (!token) {
		redirect("/sign-in");
	}

	// Set the auth token on the client
	convexClient.setAuth(token);

	return <div className="flex h-screen flex-col">{children}</div>;
}
