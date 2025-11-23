"use client";

import { authClient } from "@repo/auth/helpers/react/client";
import { roles } from "@repo/auth/permissions";
import { api } from "@repo/convex/_generated/api";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dialog";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/registry/new-york-v4/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@repo/ui/registry/new-york-v4/ui/tabs";
import { useMutation } from "convex/react";
import { useState } from "react";

type AddMemberDialogProps = React.ComponentProps<typeof Dialog> & {
	children: React.ReactNode;
	organizationId?: string;
};

const inviteMethods = ["email", "magic", "whitelist"] as const;

type InviteMethod = (typeof inviteMethods)[number];

const inviteMethodLabels: Record<InviteMethod, string> = {
	email: "Email Invite",
	magic: "Magic Link",
	whitelist: "Whitelist",
};

const roleOptions = Object.keys(roles);

function isInviteMethod(value: string): value is InviteMethod {
	return value === "email" || value === "magic" || value === "whitelist";
}

export function AddMemberDialog({
	children,
	organizationId,
	...props
}: AddMemberDialogProps) {
	const [inviteMethod, setInviteMethod] = useState<InviteMethod>("email");
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState<string>("member");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const orgId = organizationId ?? activeOrganization?.id;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const inviteByEmail = useMutation(
		(api.mutations as any).invitations.inviteByEmail,
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const inviteByMagicLink = useMutation(
		(api.mutations as any).invitations.inviteByMagicLink,
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const whitelistEmail = useMutation(
		(api.mutations as any).invitations.whitelistEmail,
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const preCreateUser = useMutation(
		(api.mutations as any).invitations.preCreateUser,
	);

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		props.onOpenChange?.(open);
		if (!open) {
			setEmail("");
			setName("");
			setRole("member");
			setError(null);
			setIsSubmitting(false);
		}
	};

	const handleInviteMethodChange = (value: string) => {
		if (isInviteMethod(value)) {
			setInviteMethod(value);
			setError(null);
		}
	};

	const handleSubmit = async () => {
		if (!email.trim()) {
			setError("Email is required");
			return;
		}

		if (!orgId) {
			setError("No organization selected");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			switch (inviteMethod) {
				case "email":
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					await inviteByEmail({
						organizationId: orgId as any,
						email: email.trim(),
						role: role !== "member" ? role : undefined,
					});
					break;
				case "magic":
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					await inviteByMagicLink({
						organizationId: orgId as any,
						email: email.trim(),
						role: role !== "member" ? role : undefined,
					});
					break;
				case "whitelist":
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					await whitelistEmail({
						organizationId: orgId as any,
						email: email.trim(),
						role: role !== "member" ? role : undefined,
					});
					break;
			}
			handleOpenChange(false);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to send invitation";
			setError(errorMessage);
			console.error("Failed to send invitation:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePreCreateUser = async () => {
		if (!email.trim() || !name.trim()) {
			setError("Email and name are required");
			return;
		}

		if (!orgId) {
			setError("No organization selected");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await preCreateUser({
				organizationId: orgId as any,
				email: email.trim(),
				name: name.trim(),
				role: role !== "member" ? role : undefined,
			});
			handleOpenChange(false);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to pre-create user";
			setError(errorMessage);
			console.error("Failed to pre-create user:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...props}>
			{children}
			<DialogContent className="w-full max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>
						Invite a new user to your application. Choose how you&apos;d like to
						send the invitation.
					</DialogDescription>
				</DialogHeader>
				<Tabs
					value={inviteMethod}
					onValueChange={handleInviteMethodChange}
					className="w-full"
				>
					<TabsList className="mb-4 grid w-full grid-cols-3">
						{inviteMethods.map((method) => (
							<TabsTrigger key={method} value={method}>
								{inviteMethodLabels[method]}
							</TabsTrigger>
						))}
					</TabsList>
					{error && (
						<div className="mb-4 rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
							{error}
						</div>
					)}
					<TabsContent value="email" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email-invite-email">Email Address</Label>
							<Input
								id="email-invite-email"
								type="email"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isSubmitting}
							/>
						</div>
						<div className="w-full space-y-2">
							<Label htmlFor="email-invite-role">Role</Label>
							<Select
								value={role}
								onValueChange={setRole}
								disabled={isSubmitting}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									{roleOptions.map((r) => (
										<SelectItem key={r} value={r}>
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="rounded-lg bg-muted p-3">
							<p className="text-muted-foreground text-sm">
								An email invitation will be sent to the user. They can accept
								the invitation to join the organization.
							</p>
						</div>
					</TabsContent>
					<TabsContent value="magic" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="magic-invite-email">Email Address</Label>
							<Input
								id="magic-invite-email"
								type="email"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isSubmitting}
							/>
						</div>
						<div className="w-full space-y-2">
							<Label htmlFor="magic-invite-role">Role</Label>
							<Select
								value={role}
								onValueChange={setRole}
								disabled={isSubmitting}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									{roleOptions.map((r) => (
										<SelectItem key={r} value={r}>
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="rounded-lg bg-muted p-3">
							<p className="text-muted-foreground text-sm">
								A magic link will be sent to the user. They can click the link
								to join the organization without needing to create an account
								first.
							</p>
						</div>
					</TabsContent>
					<TabsContent value="whitelist" className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="whitelist-email">Email Address</Label>
							<Input
								id="whitelist-email"
								type="email"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isSubmitting}
							/>
						</div>
						<div className="w-full space-y-2">
							<Label htmlFor="whitelist-role">Default Role</Label>
							<Select
								value={role}
								onValueChange={setRole}
								disabled={isSubmitting}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									{roleOptions.map((r) => (
										<SelectItem key={r} value={r}>
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="rounded-lg bg-muted p-3">
							<p className="text-muted-foreground text-sm">
								Whitelisted users can create accounts directly without requiring
								an invitation. They will be automatically assigned the selected
								role upon registration.
							</p>
						</div>
						<div className="space-y-2 border-t pt-4">
							<Label className="font-medium text-muted-foreground text-sm">
								Pre-create User Account (Optional)
							</Label>
							<div className="space-y-2">
								<Label htmlFor="pre-create-name">Name</Label>
								<Input
									id="pre-create-name"
									placeholder="User name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isSubmitting}
								/>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handlePreCreateUser}
								disabled={!name.trim() || !email.trim() || isSubmitting}
								className="w-full"
							>
								Pre-create User Account
							</Button>
						</div>
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!email.trim() || isSubmitting}
					>
						{inviteMethod === "email" && "Send Invitation"}
						{inviteMethod === "magic" && "Send Magic Link"}
						{inviteMethod === "whitelist" && "Add to Whitelist"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export const AddMemberDialogTrigger = DialogTrigger;
