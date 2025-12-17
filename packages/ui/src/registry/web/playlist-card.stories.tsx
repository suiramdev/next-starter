import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlaylistCard, PlaylistCardSkeleton } from "./playlist-card";

const meta: Meta<typeof PlaylistCard> = {
	title: "Web/PlaylistCard",
	component: PlaylistCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlaylistCard>;

export const Default: Story = {
	args: {
		name: "My Awesome Playlist",
		image:
			"https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
		ownerName: "John Doe",
		trackCount: 42,
		isSelected: false,
	},
};

export const Selected: Story = {
	args: {
		...Default.args,
		isSelected: true,
	},
};

export const NoImage: Story = {
	args: {
		name: "My Awesome Playlist",
		ownerName: "John Doe",
		trackCount: 42,
		isSelected: false,
	},
};

export const NoOwner: Story = {
	args: {
		name: "My Awesome Playlist",
		image:
			"https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
		trackCount: 42,
		isSelected: false,
	},
};

export const Loading: StoryObj = {
	render: () => <PlaylistCardSkeleton />,
};

