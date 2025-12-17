import type { Meta, StoryObj } from "@storybook/react-vite";
import { MusicVisualizer } from "./music-visualizer";

const meta: Meta<typeof MusicVisualizer> = {
	title: "Web/MusicVisualizer",
	component: MusicVisualizer,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MusicVisualizer>;

export const Playing: Story = {
	args: {
		isPlaying: true,
	},
};

export const Paused: Story = {
	args: {
		isPlaying: false,
	},
};

