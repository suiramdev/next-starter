import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "./chat-bubble";

const meta: Meta<typeof ChatBubble> = {
	title: "Web/Chat/ChatBubble",
	component: ChatBubble,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-[400px] rounded-xl border bg-card p-4">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const ReceivedMessage: Story = {
	args: {
		content: "Hey! How are you doing today?",
		isOwn: false,
		senderName: "Alex",
		senderImage:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
		timestamp: Date.now() - 300000,
		showAvatar: true,
		showName: true,
	},
};

export const SentMessage: Story = {
	args: {
		content: "I'm doing great, thanks for asking! 🎉",
		isOwn: true,
		senderName: "You",
		timestamp: Date.now() - 60000,
		showAvatar: true,
		showName: true,
	},
};

export const LongMessage: Story = {
	args: {
		content:
			"This is a much longer message to demonstrate how the chat bubble handles text wrapping and longer content. It should maintain proper spacing and readability.",
		isOwn: false,
		senderName: "Jordan",
		timestamp: Date.now() - 120000,
		showAvatar: true,
		showName: true,
	},
};

export const WithoutAvatar: Story = {
	args: {
		content: "Message without avatar shown",
		isOwn: false,
		senderName: "Sam",
		timestamp: Date.now(),
		showAvatar: false,
		showName: false,
	},
};

export const WithEmoji: Story = {
	args: {
		content: "🎵 Ready for some music trivia? 🎸🎹🥁",
		isOwn: false,
		senderName: "DJ Cool",
		timestamp: Date.now() - 180000,
		showAvatar: true,
		showName: true,
	},
};

export const NoImage: Story = {
	args: {
		content: "User without profile image",
		isOwn: false,
		senderName: "Mystery User",
		senderImage: undefined,
		timestamp: Date.now(),
		showAvatar: true,
		showName: true,
	},
};

