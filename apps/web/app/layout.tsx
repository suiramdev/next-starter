import type { Metadata } from "next";
import { ConvexProvider } from "./_components/convex-provider";
import { ThemeProvider } from "./_components/theme-provider";
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
		<html lang="en" suppressHydrationWarning>
			<body>
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
