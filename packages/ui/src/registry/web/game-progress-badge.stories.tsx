import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameProgressBadge } from "./game-progress-badge";

const meta: Meta<typeof GameProgressBadge> = {
	title: "Web/GameProgressBadge",
	component: GameProgressBadge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GameProgressBadge>;

export const FirstRound: Story = {
	args: {
		currentRound: 1,
		totalRounds: 10,
	},
};

export const MiddleRound: Story = {
	args: {
		currentRound: 5,
		totalRounds: 10,
	},
};

export const LastRound: Story = {
	args: {
		currentRound: 10,
		totalRounds: 10,
	},
};

export const SingleRound: Story = {
	args: {
		currentRound: 1,
		totalRounds: 1,
	},
};

