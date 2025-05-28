import type { Meta, StoryObj } from "@storybook/react";

import { MoreHorizontalIcon } from "./more-horizontal";

/**
 * The more horizontal icon.
 */
const meta = {
  title: "registry/admin/icons/MoreHorizontal",
  component: MoreHorizontalIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <MoreHorizontalIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MoreHorizontalIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the more horizontal icon.
 */
export const Default: Story = {};
