import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "./chat-bubble";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatMessageList } from "./chat-message-list";

const meta: Meta<typeof ChatMessageList> = {
	title: "Web/Chat/ChatMessageList",
	component: ChatMessageList,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="h-[400px] w-[400px] rounded-xl border bg-card">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatMessageList>;

const sampleMessages = [
	{
		id: "1",
		content: "Hey everyone! Ready for some music trivia? 🎵",
		senderId: "user-1",
		senderName: "Alex",
		timestamp: Date.now() - 300000,
	},
	{
		id: "2",
		content: "Absolutely! Let's go 🔥",
		senderId: "user-2",
		senderName: "Jordan",
		timestamp: Date.now() - 240000,
	},
	{
		id: "3",
		content: "I've been practicing my 80s rock knowledge",
		senderId: "user-3",
		senderName: "Sam",
		timestamp: Date.now() - 180000,
	},
	{
		id: "4",
		content: "Oh no, 80s rock is my weakness 😅",
		senderId: "user-2",
		senderName: "Jordan",
		timestamp: Date.now() - 120000,
	},
	{
		id: "5",
		content: "Don't worry, we've got a good mix in the playlist!",
		senderId: "user-1",
		senderName: "Alex",
		timestamp: Date.now() - 60000,
	},
];

export const WithMessages: Story = {
	render: () => (
		<ChatMessageList>
			{sampleMessages.map((message, index) => {
				const isOwnMessage = message.senderId === "user-1";
				const showAvatar =
					!isOwnMessage &&
					(index === 0 ||
						sampleMessages[index - 1]?.senderId !== message.senderId);

				return (
					<ChatBubble
						key={message.id}
						content={message.content}
						isOwn={isOwnMessage}
						senderName={message.senderName}
						timestamp={message.timestamp}
						showAvatar={showAvatar}
						showName={showAvatar}
					/>
				);
			})}
		</ChatMessageList>
	),
};

export const Empty: Story = {
	render: () => (
		<ChatMessageList>
			<ChatEmptyState />
		</ChatMessageList>
	),
};

export const SingleMessage: Story = {
	render: () => (
		<ChatMessageList>
			<ChatBubble
				content="Hello, is anyone here?"
				isOwn={false}
				senderName="New User"
				timestamp={Date.now()}
				showAvatar
				showName
			/>
		</ChatMessageList>
	),
};

