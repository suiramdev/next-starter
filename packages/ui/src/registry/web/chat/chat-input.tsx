"use client";

import type * as React from "react";
import { cn } from "#src/lib/utils";
import { Button } from "#src/registry/new-york-v4/ui/button";
import { Input } from "#src/registry/new-york-v4/ui/input";
import { SendIcon, SmileIcon } from "#src/registry/web/icons";

export interface ChatInputProps
	extends Omit<React.ComponentProps<"div">, "onChange"> {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	inputRef?: React.Ref<HTMLInputElement>;
	placeholder?: string;
}

export function ChatInput({
	value,
	onChange,
	onSend,
	onKeyDown,
	disabled,
	inputRef,
	placeholder = "Type a message...",
	className,
	...props
}: ChatInputProps) {
	return (
		<div className={cn("border-t p-3", className)} {...props}>
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
				>
					<SmileIcon className="size-5" />
				</Button>
				<Input
					ref={inputRef}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					className="h-9 rounded-full border-0 bg-muted/50 px-4"
					disabled={disabled}
				/>
				<Button
					type="button"
					size="icon"
					className="size-9 shrink-0 rounded-full"
					onClick={onSend}
					disabled={!value.trim() || disabled}
				>
					<SendIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}

