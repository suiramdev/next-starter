import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ConvexProvider } from "./_components/convex-provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "Spotify Blind Test",
	description: "A multiplayer Spotify blind test game",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="h-full">
			<body className="h-full">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ConvexProvider>{children}</ConvexProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
