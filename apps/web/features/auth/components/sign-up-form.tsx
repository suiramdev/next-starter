"use client";

import { SignUpForm as Form } from "@repo/auth/helpers/react/components/forms/sign-up-form";

export function SignUpForm() {
	return <Form callbackURL="/lobby" />;
}

