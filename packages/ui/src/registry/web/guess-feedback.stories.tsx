import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuessFeedback } from "./guess-feedback";

const meta: Meta<typeof GuessFeedback> = {
	title: "Web/GuessFeedback",
	component: GuessFeedback,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GuessFeedback>;

export const Success: Story = {
	args: {
		type: "success",
		message: "✅ Artist correct! +10 points",
	},
};

export const Error: Story = {
	args: {
		type: "error",
		message: "Not quite... keep trying!",
	},
};

export const FirstGuessSuccess: Story = {
	args: {
		type: "success",
		message: "🏆 First to guess artist! ✅ Title correct! +25 points",
	},
};

export const LongMessage: Story = {
	args: {
		type: "success",
		message: "✅ Artist correct! ✅ Title correct! 🏆 First to guess title! +50 points",
	},
};

