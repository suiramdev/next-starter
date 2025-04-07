import type { Meta, StoryObj } from "@storybook/react";

import { MoreVerticalIcon } from "./more-vertical";

/**
 * The more vertical icon.
 */
const meta = {
  title: "registry/admin/icons/MoreVertical",
  component: MoreVerticalIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <MoreVerticalIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MoreVerticalIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the more vertical icon.
 */
export const Default: Story = {};
