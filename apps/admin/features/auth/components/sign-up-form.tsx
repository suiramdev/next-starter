"use client";

import { SignUpForm as Form } from "@repo/auth/helpers/react/components/forms/sign-up-form";
import { basePath } from "../../../lib/constants";

export function SignUpForm() {
	return <Form callbackURL={basePath} />;
}
