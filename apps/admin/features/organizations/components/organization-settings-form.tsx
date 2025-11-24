"use client";

import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Checkbox } from "@repo/ui/registry/new-york-v4/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/registry/new-york-v4/ui/form";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const organizationSettingsSchema = z.object({
	name: z.string().min(1, { message: "Organization name is required" }).min(2, {
		message: "Organization name must be at least 2 characters long",
	}),
	allowAnonymousLogin: z.boolean(),
	allowUserSignUp: z.boolean(),
});

export type OrganizationSettingsValues = z.infer<
	typeof organizationSettingsSchema
>;

export function OrganizationSettingsForm() {
	const { data: organization, isLoading: isLoadingOrganization } = useQuery(
		convexQuery(api.queries.organizations.getActiveOrganization),
	);
	const updateOrganization = useMutation(
		api.mutations.organizations.updateOrganization,
	);

	const form = useForm<OrganizationSettingsValues>({
		resolver: zodResolver(organizationSettingsSchema),
		defaultValues: {
			name: "",
			allowAnonymousLogin: false,
			allowUserSignUp: false,
		},
	});

	// Initialize form when organization data loads
	useEffect(() => {
		if (organization) {
			form.reset({
				name: organization.name,
				allowAnonymousLogin:
					organization.settings?.allowAnonymousLogin ?? false,
				allowUserSignUp: organization.settings?.allowUserSignUp ?? false,
			});
		}
	}, [organization, form]);

	const onSubmit = async (values: OrganizationSettingsValues) => {
		if (!organization?.id) return;

		try {
			await updateOrganization({
				organizationId: organization.id,
				name: values.name,
				allowAnonymousLogin: values.allowAnonymousLogin,
				allowUserSignUp: values.allowUserSignUp,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to update organization settings";
			form.setError("root.serverError", {
				message: errorMessage,
			});
			console.error("Failed to update organization:", error);
		}
	};

	if (isLoadingOrganization || !organization) {
		return null;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{form.formState.errors.root?.serverError && (
					<div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
						{form.formState.errors.root.serverError.message}
					</div>
				)}

				<div className="space-y-6">
					{/* General Settings Section */}
					<div className="space-y-4">
						<div>
							<h2 className="font-semibold text-lg">General Settings</h2>
							<p className="text-muted-foreground text-sm">
								Manage your organization&apos;s basic information.
							</p>
						</div>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter organization name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Security Settings Section */}
					<div className="space-y-4">
						<div>
							<h2 className="font-semibold text-lg">Security Settings</h2>
							<p className="text-muted-foreground text-sm">
								Configure authentication and access options.
							</p>
						</div>

						<FormField
							control={form.control}
							name="allowAnonymousLogin"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Allow Anonymous Sign-In</FormLabel>
										<FormDescription>
											Enable users to sign in without creating an account.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="allowUserSignUp"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Allow User Sign-Up</FormLabel>
										<FormDescription>
											Allow new users to create accounts and join your
											organization.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
