import type { Meta, StoryObj } from "@storybook/react";
import { PlusIcon } from "./plus";

/**
 * The plus icon.
 */
const meta = {
  title: "registry/admin/icons/Plus",
  component: PlusIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <PlusIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PlusIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the plus icon.
 */
export const Default: Story = {};
