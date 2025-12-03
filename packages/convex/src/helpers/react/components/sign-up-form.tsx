import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@repo/ui/registry/new-york-v4/ui/field";
import { Form } from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { createAuthClient } from "../../auth-client";

export const signUpFormSchema = z.object({
	email: z.email(),
	nickname: z
		.string()
		.min(1, { message: "Nickname must be at least 1 character long" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
	confirmPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type SignUpFormProps = React.ComponentPropsWithoutRef<"form"> & {
	onError?: (error: Error) => void;
	onSuccess?: () => void;
	authClient: ReturnType<typeof createAuthClient>;
};

export function SignUpForm({
	onSuccess,
	onError,
	authClient,
	...props
}: SignUpFormProps) {
	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: "",
			nickname: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
		if (values.password !== values.confirmPassword) {
			form.setError("confirmPassword", {
				message: "Passwords do not match",
			});
			return;
		}

		await authClient.signUp.email({
			email: values.email,
			password: values.password,
			name: values.nickname,
			fetchOptions: {
				onError: ({ error }) => {
					if (error.code === "USER_ALREADY_EXISTS") {
						form.setError("email", {
							message: "This email is already in use",
						});
					} else {
						form.setError("root.serverError", {
							...error,
							message:
								error.message ?? "Something went wrong, please try again",
						});
					}

					form.resetField("password");
					form.resetField("confirmPassword");

					onError?.(error);
				},
			},
		});

		onSuccess?.();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} {...props}>
				<div className="flex flex-col gap-6">
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										{...field}
										id="email"
										type="email"
										placeholder="your@email.com"
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="nickname"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="nickname">Nickname</FieldLabel>
									<Input
										{...field}
										id="nickname"
										type="text"
										placeholder="Your nickname"
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										{...field}
										id="password"
										type="password"
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="confirmPassword">
										Confirm Password
									</FieldLabel>
									<Input
										{...field}
										id="confirmPassword"
										type="password"
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						{form.formState.errors.root?.serverError && (
							<FieldError>
								{form.formState.errors.root.serverError.message}
							</FieldError>
						)}
					</FieldGroup>
					<Button type="submit" className="w-full">
						Sign up
					</Button>
				</div>
			</form>
		</Form>
	);
}
