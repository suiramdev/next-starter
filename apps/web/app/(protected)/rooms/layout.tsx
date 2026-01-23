import { RoomsHeader } from "./_components/rooms-header";

export default function RoomsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-full flex-col overflow-hidden p-4">
			<RoomsHeader />
			<div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-hidden">
				{children}
			</div>
		</div>
	);
}
