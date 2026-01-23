"use client";

import { ChevronsUpDown } from "lucide-react";
import {
	createContext,
	forwardRef,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { cn } from "#src/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#src/registry/new-york-v4/ui/popover";

// Context for sharing state between components
interface DashedSelectorContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const DashedSelectorContext = createContext<DashedSelectorContextValue | null>(
	null,
);

function useDashedSelectorContext() {
	const context = useContext(DashedSelectorContext);
	if (!context) {
		throw new Error(
			"DashedSelector components must be used within a DashedSelector",
		);
	}
	return context;
}

// Root component
interface DashedSelectorProps {
	children: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function DashedSelector({
	children,
	open: controlledOpen,
	onOpenChange,
}: DashedSelectorProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = isControlled
		? (onOpenChange ?? (() => {}))
		: setUncontrolledOpen;

	return (
		<DashedSelectorContext.Provider value={{ open, setOpen }}>
			<Popover open={open} onOpenChange={setOpen}>
				{children}
			</Popover>
		</DashedSelectorContext.Provider>
	);
}

// Trigger button
interface DashedSelectorTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export const DashedSelectorTrigger = forwardRef<
	HTMLButtonElement,
	DashedSelectorTriggerProps
>(({ className, children, ...props }, ref) => {
	const { open } = useDashedSelectorContext();

	return (
		<PopoverTrigger asChild>
			<button
				type="button"
				role="combobox"
				aria-expanded={open}
				className={cn(
					"flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-lg border border-dashed bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50",
					className,
				)}
				ref={ref}
				{...props}
			>
				{children}
				<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
			</button>
		</PopoverTrigger>
	);
});

DashedSelectorTrigger.displayName = "DashedSelectorTrigger";

// Content/Dropdown
interface DashedSelectorContentProps
	extends Omit<React.ComponentProps<typeof PopoverContent>, "align"> {
	children: ReactNode;
}

export function DashedSelectorContent({
	className,
	children,
	...props
}: DashedSelectorContentProps) {
	return (
		<PopoverContent className={cn("p-0", className)} align="start" {...props}>
			{children}
		</PopoverContent>
	);
}

// Placeholder (empty state)
interface DashedSelectorPlaceholderProps {
	icon?: ReactNode;
	children: ReactNode;
	className?: string;
}

export function DashedSelectorPlaceholder({
	icon,
	children,
	className,
}: DashedSelectorPlaceholderProps) {
	return (
		<div className={cn("flex flex-1 items-center gap-3", className)}>
			{icon && (
				<div className="flex size-10 items-center justify-center rounded-md bg-muted">
					{icon}
				</div>
			)}
			<span className="flex-1 text-muted-foreground text-sm">{children}</span>
		</div>
	);
}

// Value display (when something is selected)
interface DashedSelectorValueProps {
	children: ReactNode;
	className?: string;
}

export function DashedSelectorValue({
	children,
	className,
}: DashedSelectorValueProps) {
	return (
		<div className={cn("min-w-0 flex-1 overflow-hidden", className)}>
			{children}
		</div>
	);
}
