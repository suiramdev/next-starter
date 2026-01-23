import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountdownDisplay } from "./countdown-display";

const meta: Meta<typeof CountdownDisplay> = {
	title: "Web/CountdownDisplay",
	component: CountdownDisplay,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CountdownDisplay>;

export const Countdown3: Story = {
	args: {
		count: 3,
	},
};

export const Countdown2: Story = {
	args: {
		count: 2,
	},
};

export const Countdown1: Story = {
	args: {
		count: 1,
	},
};

export const Ready: Story = {
	args: {
		count: 0,
	},
};

