"use client";

import { SignUpForm as Form } from "@repo/convex/helpers/react/components/sign-up-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
	const router = useRouter();

	const handleSuccess = () => {
		router.push("/");
	};

	return <Form onSuccess={handleSuccess} authClient={authClient} />;
}
