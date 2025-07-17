import type { Meta, StoryObj } from "@storybook/react-vite";

import { LogOutIcon } from "./logout";

/**
 * The logout icon.
 */
const meta = {
  title: "registry/admin/icons/LogOut",
  component: LogOutIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <LogOutIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LogOutIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the logout icon.
 */
export const Default: Story = {};
