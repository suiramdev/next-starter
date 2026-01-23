import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatContainer } from "./chat-container";

const meta: Meta<typeof ChatContainer> = {
	title: "Web/Chat/ChatContainer",
	component: ChatContainer,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="h-[500px] w-[400px]">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatContainer>;

export const Default: Story = {
	args: {
		children: (
			<div className="flex h-full items-center justify-center text-muted-foreground">
				Chat content goes here
			</div>
		),
	},
};

export const WithCustomClass: Story = {
	args: {
		className: "bg-card",
		children: (
			<div className="flex h-full items-center justify-center text-muted-foreground">
				Custom styled container
			</div>
		),
	},
};

