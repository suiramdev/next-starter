import { api } from "@repo/convex/_generated/api";
import { redirect } from "next/navigation";
import { convexClient } from "@/lib/convex-server";
import { SetupForm } from "./_components/setup-form";

export default async function SetupPage() {
	const isSetup = await convexClient.query(api.queries.setup.isSetup, {});

	if (isSetup) {
		redirect("/");
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-lg">
				<div className="flex flex-col gap-8">
					<div className="flex flex-col items-center gap-3 text-center">
						<a
							href="/"
							className="flex flex-col items-center gap-2 font-medium"
						>
							<span className="sr-only">Acme Inc.</span>
						</a>
						<h1 className="font-bold text-2xl tracking-tight">
							Welcome to Acme Inc.
						</h1>
						<p className="max-w-md text-muted-foreground text-sm">
							Let&apos;s get started by setting up your organization and
							creating your administrator account
						</p>
					</div>
					<div className="rounded-lg border bg-card p-6 shadow-sm md:p-8">
						<SetupForm />
					</div>
				</div>
			</div>
		</div>
	);
}
