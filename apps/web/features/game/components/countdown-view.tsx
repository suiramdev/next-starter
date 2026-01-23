"use client";

import { CountdownOverlay } from "@repo/ui/registry/web/countdown-overlay";

export function CountdownView() {
	return (
		<div className="relative flex h-full flex-col">
			<CountdownOverlay />
		</div>
	);
}

