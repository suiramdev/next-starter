import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@repo/ui/registry/new-york-v4/ui/field";
import { Form } from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { createAuthClient } from "../../auth-client";

export const signInFormSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type Provider = "spotify";

type SignInFormProps = React.ComponentPropsWithoutRef<"form"> & {
	onError?: (error: Error) => void;
	onSuccess?: () => void;
	providers?: Provider[];
	anonymousSignIn?: boolean;
	authClient: ReturnType<typeof createAuthClient>;
};

export function SignInForm({
	onSuccess,
	onError,
	providers = [],
	anonymousSignIn = false,
	authClient,
	...props
}: SignInFormProps) {
	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
		await authClient.signIn.email({
			email: values.email,
			password: values.password,
			fetchOptions: {
				onError: ({ error }) => {
					if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
						form.setError("root.serverError", {
							message: "Invalid email or password",
						});
						form.resetField("password");
					} else {
						form.setError("root.serverError", {
							...error,
							message:
								error.message ?? "Something went wrong, please try again",
						});
					}

					onError?.(error);
				},
			},
		});

		onSuccess?.();
	};

	const handleSocialSignIn = async (provider: Provider) => {
		await authClient.signIn.social({
			provider,
			fetchOptions: {
				onError: ({ error }) => {
					form.setError("root.serverError", {
						...error,
						message: error.message ?? "Something went wrong, please try again",
					});
					onError?.(error);
				},
			},
		});

		onSuccess?.();
	};

	const handleAnonymousSignIn = async () => {
		await authClient.signIn.anonymous({
			fetchOptions: {
				onError: ({ error }) => {
					form.setError("root.serverError", {
						...error,
						message: error.message ?? "Something went wrong, please try again",
					});
					onError?.(error);
				},
			},
		});

		onSuccess?.();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} {...props}>
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
					<Field>
						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</Field>
					<FieldSeparator>Or continue with</FieldSeparator>
					{providers.length > 0 && (
						<FieldGroup>
							{providers.includes("spotify") && (
								<Field>
									<Button
										type="button"
										variant="outline"
										className="w-full bg-[#1DB954] text-white hover:bg-[#1ed760]"
										onClick={() => handleSocialSignIn("spotify")}
									>
										<svg
											aria-label="Spotify"
											role="img"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											className="size-4"
										>
											<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
										</svg>
										Sign in Spotify
									</Button>
								</Field>
							)}
							<Field>
								{anonymousSignIn && (
									<Button
										type="button"
										variant="outline"
										className="w-full"
										onClick={handleAnonymousSignIn}
									>
										Continue as guest
									</Button>
								)}
							</Field>
						</FieldGroup>
					)}
					{form.formState.errors.root?.serverError && (
						<FieldError>
							{form.formState.errors.root.serverError.message}
						</FieldError>
					)}
				</FieldGroup>
			</form>
		</Form>
	);
}
