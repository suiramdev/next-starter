import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ChatInput } from "./chat-input";

const meta: Meta<typeof ChatInput> = {
	title: "Web/Chat/ChatInput",
	component: ChatInput,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-[400px] rounded-xl border bg-card">
				<Story />
			</div>
		),
	],
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Empty: Story = {
	args: {
		value: "",
		onChange: () => {},
		onSend: () => alert("Send clicked"),
	},
};

export const WithText: Story = {
	args: {
		value: "Hello, everyone!",
		onChange: () => {},
		onSend: () => alert("Send clicked"),
	},
};

export const Disabled: Story = {
	args: {
		value: "",
		onChange: () => {},
		onSend: () => {},
		disabled: true,
		placeholder: "Chat is disabled...",
	},
};

export const CustomPlaceholder: Story = {
	args: {
		value: "",
		onChange: () => {},
		onSend: () => {},
		placeholder: "Say something nice...",
	},
};

function InteractiveChatInputDemo() {
	const [value, setValue] = useState("");

	const handleSend = () => {
		if (value.trim()) {
			alert(`Sending: ${value}`);
			setValue("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<ChatInput
			value={value}
			onChange={setValue}
			onSend={handleSend}
			onKeyDown={handleKeyDown}
		/>
	);
}

export const Interactive: Story = {
	render: () => <InteractiveChatInputDemo />,
};

