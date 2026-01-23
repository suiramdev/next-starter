import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioProgressBar } from "./audio-progress-bar";

const meta: Meta<typeof AudioProgressBar> = {
	title: "Web/AudioProgressBar",
	component: AudioProgressBar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AudioProgressBar>;

export const Start: Story = {
	args: {
		progress: 0,
	},
};

export const Quarter: Story = {
	args: {
		progress: 25,
	},
};

export const Half: Story = {
	args: {
		progress: 50,
	},
};

export const ThreeQuarters: Story = {
	args: {
		progress: 75,
	},
};

export const Complete: Story = {
	args: {
		progress: 100,
	},
};

