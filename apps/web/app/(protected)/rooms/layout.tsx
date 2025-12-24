import { RoomsHeader } from "./_components/rooms-header";

export default function RoomsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-1 flex-col p-4">
			<RoomsHeader />
			<div className="container mx-auto flex flex-1 flex-col">{children}</div>
		</div>
	);
}
