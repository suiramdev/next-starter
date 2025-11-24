"use client";

import { SignInForm as Form } from "@repo/auth/helpers/react/components/forms/sign-in-form";
import { basePath } from "../../../lib/constants";

export function SignInForm() {
	return <Form callbackURL={basePath} />;
}
