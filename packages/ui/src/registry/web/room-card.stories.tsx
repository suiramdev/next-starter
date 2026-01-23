import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoomCard } from "./room-card";

const meta: Meta<typeof RoomCard> = {
	title: "Web/RoomCard",
	component: RoomCard,
	parameters: {
		layout: "centered",
		backgrounds: {
			default: "dark",
		},
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="w-[400px]">
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof RoomCard>;

const samplePlayers = [
	{
		userId: "1",
		name: "Alice",
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
	},
	{
		userId: "2",
		name: "Bob",
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
	},
	{
		userId: "3",
		name: "Charlie",
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
	},
	{
		userId: "4",
		name: "Dave",
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
	},
	{
		userId: "5",
		name: "Eve",
		image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve",
	},
];

export const Default: Story = {
	args: {
		name: "Chill Vibes Room",
		playlistName: "Summer Hits 2024",
		playlistImage:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		playerCount: 5,
		players: samplePlayers,
		disabled: false,
	},
};

export const FewPlayers: Story = {
	args: {
		name: "Intimate Session",
		playlistName: "Jazz Classics",
		playlistImage:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		playerCount: 2,
		players: samplePlayers.slice(0, 2),
	},
};

export const NoPlaylistImage: Story = {
	args: {
		name: "Mystery Room",
		playlistName: "Unknown Mix",
		playerCount: 3,
		players: samplePlayers.slice(0, 3),
	},
};

export const NoPlaylistName: Story = {
	args: {
		name: "Just Hanging Out",
		playlistImage:
			"https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
		playerCount: 4,
		players: samplePlayers.slice(0, 4),
	},
};

export const Disabled: Story = {
	args: {
		...Default.args,
		disabled: true,
	},
};
