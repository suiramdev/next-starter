"use client";

import type { ReactNode } from "react";
import { cn } from "#src/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "#src/registry/new-york-v4/ui/command";
import { Spinner } from "#src/registry/new-york-v4/ui/spinner";

interface SearchableListProps {
	onSearch?: (query: string) => void;
	placeholder?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	children?: ReactNode;
	className?: string;
}

export function SearchableList({
	onSearch,
	placeholder = "Search...",
	emptyMessage = "No results found.",
	isLoading = false,
	children,
	className,
}: SearchableListProps) {
	return (
		<Command shouldFilter={false} className={className}>
			<CommandInput placeholder={placeholder} onValueChange={onSearch} />
			<CommandList>
				<CommandEmpty className="flex items-center justify-center py-6 text-center text-sm">
					{isLoading ? <Spinner /> : <span>{emptyMessage}</span>}
				</CommandEmpty>
				{children}
			</CommandList>
		</Command>
	);
}

interface SearchableListGroupProps {
	heading?: string;
	children: ReactNode;
}

export function SearchableListGroup({
	heading,
	children,
}: SearchableListGroupProps) {
	return <CommandGroup heading={heading}>{children}</CommandGroup>;
}

interface SearchableListItemProps {
	value: string;
	onSelect?: () => void;
	children: ReactNode;
	className?: string;
}

export function SearchableListItem({
	value,
	onSelect,
	children,
	className,
}: SearchableListItemProps) {
	return (
		<CommandItem
			value={value}
			onSelect={onSelect}
			className={cn("flex items-center gap-3", className)}
		>
			{children}
		</CommandItem>
	);
}
