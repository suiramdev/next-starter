"use client";

import { SignInForm as Form } from "@repo/convex/helpers/react/components/sign-in-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
	const router = useRouter();

	const handleSuccess = () => {
		router.push("/");
	};

	return (
		<Form
			authClient={authClient}
			onSuccess={handleSuccess}
			providers={["spotify"]}
			anonymousSignIn
		/>
	);
}
