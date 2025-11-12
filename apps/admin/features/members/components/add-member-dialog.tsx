"use client";

import { roles } from "@repo/auth/permissions";
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
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@repo/ui/registry/new-york-v4/ui/tabs";
import { useState } from "react";

type AddMemberDialogProps = React.ComponentProps<typeof Dialog> & {
	children: React.ReactNode;
};

const inviteMethods = ["email", "magic", "whitelist"] as const;

type InviteMethod = (typeof inviteMethods)[number];

const availableInviteMethods: InviteMethod[] = ["whitelist"];

const inviteMethodLabels: Record<InviteMethod, string> = {
	email: "Email Invite",
	magic: "Magic Link",
	whitelist: "Whitelist",
};

const roleOptions = Object.keys(roles);

function isInviteMethod(value: string): value is InviteMethod {
	return value === "email" || value === "magic" || value === "whitelist";
}

export function AddMemberDialog({ children, ...props }: AddMemberDialogProps) {
	const [inviteMethod, setInviteMethod] = useState<InviteMethod>("whitelist");
	const [open, setOpen] = useState(false);

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		props.onOpenChange?.(open);
	};

	const handleInviteMethodChange = (value: string) => {
		if (isInviteMethod(value)) {
			setInviteMethod(value);
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
							<TabsTrigger
								key={method}
								value={method}
								disabled={!availableInviteMethods.includes(method)}
							>
								{inviteMethodLabels[method]}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value={"whitelist"} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="whitelist-email">Email Address</Label>
							<Input
								id="whitelist-email"
								type="email"
								placeholder="user@example.com"
							/>
						</div>
						<div className="w-full space-y-2">
							<Label htmlFor="whitelist-role">Default Role</Label>
							<Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									{roleOptions.map((role) => (
										<SelectItem key={role} value={role}>
											{role.charAt(0).toUpperCase() + role.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<Switch id="auto-approve" />
							<Label htmlFor="auto-approve">Auto-approve registration</Label>
						</div>
						<div className="rounded-lg bg-muted p-3">
							<p className="text-muted-foreground text-sm">
								Whitelisted users can create accounts directly without requiring
								an invitation. They will be automatically assigned the selected
								role upon registration.
							</p>
						</div>
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<Button variant="outline" onClick={() => handleOpenChange(false)}>
						Cancel
					</Button>
					<Button>{inviteMethod === "whitelist" && "Add to Whitelist"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export const AddMemberDialogTrigger = DialogTrigger;
