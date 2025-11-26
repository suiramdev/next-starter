"use client";

import { SignInForm as Form } from "@repo/auth/helpers/react/components/forms/sign-in-form";
import { useRouter } from "next/navigation";

export function SignInForm() {
	const router = useRouter();

	const handleSuccess = () => {
		router.push("/");
	};

	return <Form enableAnonymousSignIn onSuccess={handleSuccess} />;
}
