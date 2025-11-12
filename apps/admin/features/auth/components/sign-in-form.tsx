"use client";

import { SignInForm as Form } from "@repo/auth/helpers/react/components/forms/sign-in-form";
import { useRouter } from "next/navigation";

export function SignInForm() {
	const navigate = useRouter();

	const onSuccess = () => {
		navigate.push("/");
	};

	return <Form onSuccess={onSuccess} />;
}
