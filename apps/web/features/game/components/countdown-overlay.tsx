"use client";

import { CountdownDisplay } from "@repo/ui/registry/web/countdown-display";
import { useEffect, useState } from "react";

export function CountdownOverlay() {
	const [count, setCount] = useState(3);

	useEffect(() => {
		if (count <= 0) return;

		const timer = setTimeout(() => {
			setCount((prev) => prev - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [count]);

	return (
		<div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
			<CountdownDisplay count={count} />
		</div>
	);
}
