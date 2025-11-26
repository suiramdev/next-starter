"use client";

import { SignUpForm as Form } from "@repo/auth/helpers/react/components/forms/sign-up-form";
import { useRouter } from "next/navigation";

export function SignUpForm() {
	const router = useRouter();

	const handleSuccess = () => {
		router.push("/");
	};

	return <Form onSuccess={handleSuccess} />;
}
