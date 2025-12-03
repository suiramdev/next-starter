import { TopBar } from "./_components/top-bar";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen flex-col">
			<TopBar />
			<main className="flex flex-1 flex-col overflow-hidden">{children}</main>
		</div>
	);
}
