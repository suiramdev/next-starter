"use client";

import { convexQuery } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
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
import { Skeleton } from "@repo/ui/registry/new-york-v4/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const memberProfileSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Name is required" })
		.min(2, { message: "Name must be at least 2 characters long" }),
	email: z.email({ message: "Please enter a valid email address" }),
	image: z.string().refine(
		(val) => {
			if (val === "") return true;
			return z.url().safeParse(val).success;
		},
		{
			message: "Please enter a valid URL",
		},
	),
});

type MemberProfileValues = z.infer<typeof memberProfileSchema>;

type MemberProfileFormProps = {
	userId: string;
};

export function MemberProfileForm({ userId }: MemberProfileFormProps) {
	const { data: member, isLoading: isLoadingMember } = useQuery(
		convexQuery(api.queries.organizations.getMember, {
			userId: userId,
		}),
	);

	const updateProfile = useMutation(api.mutations.users.updateUser);

	const form = useForm<MemberProfileValues>({
		resolver: zodResolver(memberProfileSchema),
		defaultValues: {
			name: "",
			email: "",
			image: "",
		},
	});

	// Initialize form when member data loads
	useEffect(() => {
		if (member?.user) {
			form.reset({
				name: member.user.name,
				email: member.user.email,
				image: member.user.image ?? "",
			});
		}
	}, [member, form]);

	const onSubmit = async (values: MemberProfileValues) => {
		try {
			await updateProfile({
				name: values.name.trim(),
				image:
					values.image && values.image.trim() !== ""
						? values.image.trim()
						: undefined,
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update profile";
			form.setError("root.serverError", {
				message: errorMessage,
			});
			console.error("Failed to update profile:", err);
		}
	};

	const handleCancel = () => {
		if (member?.user) {
			form.reset({
				name: member.user.name,
				email: member.user.email,
				image: member.user.image ?? "",
			});
		}
		form.clearErrors();
	};

	if (isLoadingMember || !member?.user) {
		return <MemberProfileFormSkeleton />;
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{form.formState.errors.root?.serverError && (
					<div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
						{form.formState.errors.root.serverError.message}
					</div>
				)}

				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="user-name">Name</FormLabel>
								<FormControl>
									<Input
										id="user-name"
										{...field}
										disabled={form.formState.isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="user-email">Email</FormLabel>
								<FormControl>
									<Input
										id="user-email"
										type="email"
										{...field}
										disabled={form.formState.isSubmitting}
									/>
								</FormControl>
								<FormDescription>
									Changing your email will require verification.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="user-image">Image URL</FormLabel>
								<FormControl>
									<Input
										id="user-image"
										type="url"
										placeholder="https://example.com/avatar.jpg"
										{...field}
										disabled={form.formState.isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex gap-2">
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						disabled={form.formState.isSubmitting}
					>
						Cancel
					</Button>
				</div>
			</form>
		</Form>
	);
}

export function MemberProfileFormSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{/* Name field skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-12" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Email field skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-14" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-4 w-64" />
				</div>

				{/* Image field skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>

			{/* Buttons skeleton */}
			<div className="flex gap-2">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-10 w-24" />
			</div>
		</div>
	);
}
