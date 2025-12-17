import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoundScoreIndicators } from "./round-score-indicators";

const meta: Meta<typeof RoundScoreIndicators> = {
	title: "Web/RoundScoreIndicators",
	component: RoundScoreIndicators,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RoundScoreIndicators>;

export const None: Story = {
	args: {
		guessedArtist: false,
		guessedTitle: false,
	},
};

export const ArtistOnly: Story = {
	args: {
		guessedArtist: true,
		guessedTitle: false,
	},
};

export const TitleOnly: Story = {
	args: {
		guessedArtist: false,
		guessedTitle: true,
	},
};

export const Both: Story = {
	args: {
		guessedArtist: true,
		guessedTitle: true,
	},
};

export const BothWithPoints: Story = {
	args: {
		guessedArtist: true,
		guessedTitle: true,
		points: 25,
	},
};

export const ArtistWithPoints: Story = {
	args: {
		guessedArtist: true,
		guessedTitle: false,
		points: 10,
	},
};

