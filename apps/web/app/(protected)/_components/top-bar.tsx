import { CurrentUserDropdown } from "@/features/users/components/current-user-dropdown";

export function TopBar() {
	return (
		<header className="border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex w-full items-center justify-between">
				<span className="font-bold text-xl">Blind Test</span>

				<div className="flex items-center gap-2">
					<CurrentUserDropdown />
				</div>
			</div>
		</header>
	);
}
