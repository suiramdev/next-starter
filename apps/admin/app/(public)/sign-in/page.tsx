import { SignInForm } from "@/features/auth/components/sign-in-form";

export default async function Page() {
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
