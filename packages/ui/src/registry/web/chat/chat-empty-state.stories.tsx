import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatEmptyState } from "./chat-empty-state";

const meta: Meta<typeof ChatEmptyState> = {
	title: "Web/Chat/ChatEmptyState",
	component: ChatEmptyState,
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
type Story = StoryObj<typeof ChatEmptyState>;

export const Default: Story = {};

