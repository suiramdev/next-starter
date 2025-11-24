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
import { Textarea } from "@repo/ui/registry/new-york-v4/ui/textarea";
import { useState } from "react";

type BanUserDialogProps = React.ComponentProps<typeof Dialog> & {
	children?: React.ReactNode;
	userId: string;
};

export function BanUserDialog({
	children,
	userId,
	...props
}: BanUserDialogProps) {
	const [open, setOpen] = useState(false);
	const [banReason, setBanReason] = useState("");
	const [banEndDate, setBanEndDate] = useState("");

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		props.onOpenChange?.(open);
		if (!open) {
			setBanReason("");
			setBanEndDate("");
		}
	};

	const handleBan = async () => {
		// const banExpiresIn = banEndDate
		// 	? new Date(banEndDate).getTime()
		// 	: undefined;

		handleOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...props}>
			{children}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ban User</DialogTitle>
					<DialogDescription>
						Are you sure you want to ban this user?
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-2">
					<div className="space-y-2">
						<Label htmlFor="ban-reason">Reason (optional)</Label>
						<Textarea
							id="ban-reason"
							placeholder="Enter a reason for the ban (optional)"
							value={banReason}
							onChange={(e) => setBanReason(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="ban-end-date">End Date (optional)</Label>
						<Input
							id="ban-end-date"
							type="date"
							value={banEndDate}
							onChange={(e) => setBanEndDate(e.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="destructive" onClick={handleBan}>
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

export const BanUserDialogTrigger = DialogTrigger;
