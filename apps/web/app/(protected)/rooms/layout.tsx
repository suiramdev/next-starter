import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { XIcon } from "@repo/ui/registry/web/icons";
import Link from "next/link";

export default function RoomsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-1 flex-col py-8">
			<header className="container mx-auto mb-8">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/">
						<XIcon className="size-4" />
						<span className="sr-only">Close</span>
					</Link>
				</Button>
			</header>
			<div className="container mx-auto flex flex-1 flex-col">{children}</div>
		</div>
	);
}
