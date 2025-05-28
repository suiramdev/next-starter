import type { Meta, StoryObj } from "@storybook/react";
import { TrashIcon } from "./trash";

/**
 * The trash icon.
 */
const meta = {
  title: "registry/admin/icons/Trash",
  component: TrashIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <TrashIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TrashIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the trash icon.
 */
export const Default: Story = {};
