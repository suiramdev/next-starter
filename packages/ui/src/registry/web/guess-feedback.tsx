import type * as React from "react";

import { cn } from "#src/lib/utils";
import { CheckIcon, XIcon } from "@repo/ui/registry/web/icons";

interface GuessFeedbackProps {
	type: "success" | "error";
	message: string;
	className?: string;
}

function GuessFeedback({ type, message, className }: GuessFeedbackProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-lg px-4 py-2 text-sm",
				type === "success"
					? "bg-green-500/10 text-green-600 dark:text-green-400"
					: "bg-red-500/10 text-red-600 dark:text-red-400",
				className,
			)}
		>
			{type === "success" ? (
				<CheckIcon className="size-4" />
			) : (
				<XIcon className="size-4" />
			)}
			{message}
		</div>
	);
}

export { GuessFeedback };

