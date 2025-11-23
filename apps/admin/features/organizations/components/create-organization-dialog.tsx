"use client";

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
import { useState } from "react";

type CreateOrganizationDialogProps = React.ComponentProps<typeof Dialog> & {
	children?: React.ReactNode;
};

export function CreateOrganizationDialog({
	children,
	...props
}: CreateOrganizationDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		props.onOpenChange?.(open);
		if (!open) {
			setName("");
			setError(null);
		}
	};

	const handleSubmit = async () => {
		if (!name.trim()) return;

		setError(null);
		handleOpenChange(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && name.trim()) {
			handleSubmit();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...props}>
			{children}
			<DialogContent className="w-full max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Organization</DialogTitle>
					<DialogDescription>
						Enter a name for your new organization.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-2">
					{error && (
						<div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
							{error}
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="organization-name">Organization Name</Label>
						<Input
							id="organization-name"
							placeholder="Enter organization name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							onKeyDown={handleKeyDown}
							autoFocus
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => handleOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!name.trim()}>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export const CreateOrganizationDialogTrigger = DialogTrigger;
