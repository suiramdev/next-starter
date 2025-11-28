import { getToken } from "@convex-dev/better-auth/nextjs";
import { api } from "@repo/convex/_generated/api";
import { createAuth } from "@repo/convex/auth";
import { Separator } from "@repo/ui/registry/new-york-v4/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ui/registry/new-york-v4/ui/sidebar";
import { redirect } from "next/navigation";
import { Sidebar } from "@/app/(protected)/_components/sidebar";
import { convexClient } from "@/lib/convex-server";
import { ThemeSwitcher } from "./_components/theme-switcher";

export default async function Layout({
	children,
	breadcrumb,
}: Readonly<{
	children: React.ReactNode;
	breadcrumb: React.ReactNode;
}>) {
	const token = await getToken(createAuth);
	console.log("token", token);

	if (!token) {
		redirect("/sign-in");
	}

	// Set the auth token on the client
	convexClient.setAuth(token);

	// Check if user has admin role
	const hasAdminRole = await convexClient.query(api.queries.users.hasRole, {
		role: "admin",
	});

	if (!hasAdminRole) {
		redirect("/sign-in");
	}

	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mx-2 data-[orientation=vertical]:h-4"
						/>
						{breadcrumb}
						<div className="flex flex-1 items-center justify-end gap-2">
							<ThemeSwitcher />
						</div>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
