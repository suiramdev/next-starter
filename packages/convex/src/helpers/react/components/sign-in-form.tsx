import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { createAuthClient } from "../../auth-client";

export const signInFormSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type SignInFormProps = React.ComponentPropsWithoutRef<"form"> & {
	onError?: (error: Error) => void;
	onSuccess?: () => void;
	enableAnonymousSignIn?: boolean;
	authClient: ReturnType<typeof createAuthClient>;
};

export function SignInForm({
	onSuccess,
	onError,
	enableAnonymousSignIn = false,
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
				<div className="flex flex-col gap-6">
					<div className="grid gap-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											id="email"
											type="email"
											placeholder="your@email.com"
											required
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input id="password" type="password" required {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Button type="submit" className="w-full">
							Sign in
						</Button>
						{enableAnonymousSignIn && (
							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={handleAnonymousSignIn}
							>
								Continue as guest
							</Button>
						)}
						{form.formState.errors.root?.serverError && (
							<FormMessage>
								{form.formState.errors.root.serverError.message}
							</FormMessage>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}

