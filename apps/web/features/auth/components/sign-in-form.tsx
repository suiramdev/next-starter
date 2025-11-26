"use client";

import { SignInForm as Form } from "@repo/auth/helpers/react/components/forms/sign-in-form";

export function SignInForm() {
	return <Form callbackURL="/lobby" />;
}

