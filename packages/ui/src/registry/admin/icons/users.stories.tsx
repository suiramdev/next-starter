import type { Meta, StoryObj } from "@storybook/react-vite";

import { UsersIcon } from "./users";

/**
 * The settings icon.
 */
const meta = {
  title: "registry/admin/icons/Users",
  component: UsersIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <UsersIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof UsersIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the layout dashboard icon.
 */
export const Default: Story = {};
