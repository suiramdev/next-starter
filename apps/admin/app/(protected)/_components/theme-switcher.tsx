"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@repo/ui/registry/admin/icons";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/registry/new-york-v4/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
	};

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="Toggle theme">
						{theme === "system" ? (
							<MonitorIcon className="size-4" />
						) : theme === "dark" ? (
							<MoonIcon className="size-4" />
						) : (
							<SunIcon className="size-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => handleThemeChange("system")}>
						<MonitorIcon className="size-4" />
						System
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleThemeChange("light")}>
						<SunIcon className="size-4" />
						Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleThemeChange("dark")}>
						<MoonIcon className="size-4" />
						Dark
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
