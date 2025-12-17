import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrackImage } from "./track-image";

const meta: Meta<typeof TrackImage> = {
	title: "Web/TrackImage",
	component: TrackImage,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TrackImage>;

export const WithImage: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VyZmluZ3xlbnwwfHwwfHx8MA%3D%3D",
		alt: "Album cover",
		width: 200,
		height: 200,
	},
};

export const NoImage: Story = {
	args: {
		src: null,
		alt: "Album cover",
		width: 200,
		height: 200,
	},
};

export const CustomSize: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
		alt: "Album cover",
		width: 300,
		height: 300,
	},
};

