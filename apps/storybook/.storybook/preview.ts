import type { Preview } from "@storybook/react-vite";
import "@repo/ui/styles/globals.css";

// Mock process.env for Next.js Image component
if (typeof window !== "undefined") {
	window.process = window.process || {};
	window.process.env = window.process.env || {};
}

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
