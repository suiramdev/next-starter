"use client";

import { createAuthClient } from "@repo/convex/helpers/auth-client";
import { SignUpForm as Form } from "@repo/convex/helpers/react/components/sign-up-form";
import { useRouter } from "next/navigation";

const authClient = createAuthClient(process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "");

export function SignUpForm() {
	const router = useRouter();

	const handleSuccess = () => {
		router.push("/");
	};

	return <Form onSuccess={handleSuccess} authClient={authClient} />;
}
