import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlayerScoreRow } from "./player-score-row";

const meta: Meta<typeof PlayerScoreRow> = {
	title: "Web/PlayerScoreRow",
	component: PlayerScoreRow,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-[400px]">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlayerScoreRow>;

export const Default: Story = {
	args: {
		rank: 1,
		name: "Alice",
		image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		points: 150,
		isHost: false,
		isCurrentUser: false,
	},
};

export const Host: Story = {
	args: {
		rank: 1,
		name: "Bob",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		points: 200,
		isHost: true,
		isCurrentUser: false,
	},
};

export const CurrentUser: Story = {
	args: {
		rank: 2,
		name: "Charlie",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		points: 120,
		isHost: false,
		isCurrentUser: true,
	},
};

export const NoImage: Story = {
	args: {
		rank: 3,
		name: "Diana",
		image: null,
		points: 80,
		isHost: false,
		isCurrentUser: false,
	},
};

export const HighScore: Story = {
	args: {
		rank: 1,
		name: "Winner",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		points: 9999,
		isHost: true,
		isCurrentUser: true,
	},
};

