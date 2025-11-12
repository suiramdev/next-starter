"use client";

import { authClient } from "@repo/auth/helpers/react/client";
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
import { useState } from "react";

type DeleteMemberDialogProps = React.ComponentProps<typeof Dialog> & {
	children?: React.ReactNode;
	memberIdOrEmail: string;
	organizationId: string;
};

export function DeleteMemberDialog({
	children,
	memberIdOrEmail,
	organizationId,
	...props
}: DeleteMemberDialogProps) {
	const [open, setOpen] = useState(false);

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		props.onOpenChange?.(open);
	};

	const handleDelete = async () => {
		await authClient.organization.removeMember({
			memberIdOrEmail,
			organizationId,
		});

		handleOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...props}>
			{children}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this user? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="destructive" onClick={handleDelete}>
						Confirm
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							handleOpenChange(false);
						}}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export const DeleteMemberDialogTrigger = DialogTrigger;
