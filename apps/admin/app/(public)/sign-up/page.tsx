import Link from "next/link";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default async function HomePage() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<a
							href="/"
							className="flex flex-col items-center gap-2 font-medium"
						>
							<span className="sr-only">Acme Inc.</span>
						</a>
						<h1 className="font-bold text-xl">Welcome to Acme Inc.</h1>
						<div className="text-center text-sm">
							Already have an account?{" "}
							<Link
								href="/sign-in"
								className="underline underline-offset-4 hover:text-primary"
							>
								Sign in
							</Link>
						</div>
					</div>
					<SignUpForm />
					<div className="text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
						By signing up, you agree to our{" "}
						<Link href="/terms-of-service">Terms of Service</Link> and{" "}
						<Link href="/privacy-policy">Privacy Policy</Link>.
					</div>
				</div>
			</div>
		</div>
	);
}
