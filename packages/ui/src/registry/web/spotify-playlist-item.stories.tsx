import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpotifyPlaylistItem } from "./spotify-playlist-item";

const meta: Meta<typeof SpotifyPlaylistItem> = {
	title: "Web/SpotifyPlaylistItem",
	component: SpotifyPlaylistItem,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SpotifyPlaylistItem>;

export const Default: Story = {
	args: {
		playlist: {
			name: "Top Hits 2024",
			image:
				"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
			totalTracks: 50,
			ownerName: "Spotify",
		},
	},
};

export const NoImage: Story = {
	args: {
		playlist: {
			name: "My Playlist",
			image: undefined,
			totalTracks: 12,
			ownerName: "User",
		},
	},
};
