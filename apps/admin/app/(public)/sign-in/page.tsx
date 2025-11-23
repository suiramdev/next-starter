import { api } from "@repo/convex/_generated/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { convexClient } from "@/lib/convex-server";

export default async function Page() {
	const isSetup = await convexClient.query(api.queries.setup.isSetup, {});

	if (!isSetup) {
		redirect("/setup");
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2">
							<a
								href="/"
								className="flex flex-col items-center gap-2 font-medium"
							>
								<span className="sr-only">Acme Inc.</span>
							</a>
							<h1 className="font-bold text-xl">Welcome back to Acme Inc.</h1>
							<div className="text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link
									href="/sign-up"
									className="underline underline-offset-4 hover:text-primary"
								>
									Sign up
								</Link>
							</div>
						</div>
						<SignInForm />
					</div>
					<div className="text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
						By signing in, you agree to our{" "}
						<a href="/terms-of-service">Terms of Service</a> and{" "}
						<a href="/privacy-policy">Privacy Policy</a>.
					</div>
				</div>
			</div>
		</div>
	);
}
