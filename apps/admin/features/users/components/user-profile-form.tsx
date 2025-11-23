"use client";

import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

type UserProfileFormProps = {
	userId: string;
};

export function UserProfileForm({ userId }: UserProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const user = useQuery(api.queries.organizations.getMember, {
		userId: userId,
	});

	const updateProfile = useMutation(api.mutations.users.updateUser);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [image, setImage] = useState<string | null>(null);

	// Initialize form when user data loads
	if (user && !isEditing && name === "") {
		setName(user.name);
		setEmail(user.email);
		setImage(user.image ?? null);
	}

	const handleSave = async () => {
		setIsSubmitting(true);
		setError(null);

		try {
			await updateProfile({
				name: name.trim(),
				image: image ?? undefined,
			});
			setIsEditing(false);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update profile";
			setError(errorMessage);
			console.error("Failed to update profile:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setImage(user.image ?? null);
		}
		setIsEditing(false);
		setError(null);
	};

	if (!user) {
		return <div className="text-muted-foreground">Loading user profile...</div>;
	}

	return (
		<div className="space-y-6">
			{error && (
				<div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
					{error}
				</div>
			)}

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="user-name">Name</Label>
					<Input
						id="user-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={!isEditing || isSubmitting}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="user-email">Email</Label>
					<Input
						id="user-email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={!isEditing || isSubmitting}
					/>
					<p className="text-muted-foreground text-xs">
						Changing your email will require verification.
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="user-image">Image URL</Label>
					<Input
						id="user-image"
						type="url"
						value={image ?? ""}
						onChange={(e) => setImage(e.target.value || null)}
						disabled={!isEditing || isSubmitting}
						placeholder="https://example.com/avatar.jpg"
					/>
				</div>
			</div>

			<div className="flex gap-2">
				{!isEditing ? (
					<Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
				) : (
					<>
						<Button
							onClick={handleSave}
							disabled={isSubmitting || !name.trim() || !email.trim()}
						>
							{isSubmitting ? "Saving..." : "Save Changes"}
						</Button>
						<Button
							variant="outline"
							onClick={handleCancel}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
