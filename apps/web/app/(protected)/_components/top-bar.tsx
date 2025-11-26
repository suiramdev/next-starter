import { NavUser } from "./nav-user";

export function TopBar() {
	return (
		<header className="border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto flex w-full items-center justify-between">
				<span className="font-bold text-xl">Blind Test</span>

				<NavUser />
			</div>
		</header>
	);
}
