import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoomPreviewCard } from "./room-preview-card";

const meta: Meta<typeof RoomPreviewCard> = {
	title: "Web/RoomPreviewCard",
	component: RoomPreviewCard,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="h-[600px] w-[400px]">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RoomPreviewCard>;

export const Default: Story = {
	args: {
		room: {
			name: "Friday Night Vibes",
			playlistName: "Party Hits",
			playlistImage:
				"https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
			playlistAuthor: "DJ Cool",
			playerCount: 3,
			status: "waiting",
			code: "ABCD",
		},
		players: [
			{
				id: "1",
				name: "Alice",
				score: 100,
				isHost: true,
			},
			{
				id: "2",
				name: "Bob",
				score: 80,
				isHost: false,
			},
			{
				id: "3",
				name: "Charlie",
				score: 45,
				isHost: false,
			},
		],
		onJoin: () => alert("Join clicked"),
	},
};

export const NoPlaylist: Story = {
	args: {
		room: {
			name: "Chill Lounge",
			playerCount: 1,
			status: "waiting",
			code: "EFGH",
		},
		players: [
			{
				id: "1",
				name: "Host User",
				score: 0,
				isHost: true,
			},
		],
		onJoin: () => alert("Join clicked"),
	},
};

export const GameInProgress: Story = {
	args: {
		room: {
			name: "Competitive Arena",
			playlistName: "Hard Rock",
			playerCount: 4,
			status: "playing",
			code: "IJKL",
		},
		players: [
			{
				id: "1",
				name: "Pro Gamer",
				score: 150,
				isHost: true,
			},
		],
		onJoin: () => alert("Join clicked"),
	},
};

export const EmptyPlayers: Story = {
	args: {
		room: {
			name: "New Room",
			playerCount: 0,
			status: "waiting",
			code: "MNOP",
		},
		players: [],
		onJoin: () => alert("Join clicked"),
	},
};
