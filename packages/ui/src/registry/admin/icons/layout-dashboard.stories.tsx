import type { Meta, StoryObj } from "@storybook/react-vite";

import { LayoutDashboardIcon } from "./layout-dashboard";

/**
 * The layout dashboard icon.
 */
const meta = {
  title: "registry/admin/icons/LayoutDashboard",
  component: LayoutDashboardIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <LayoutDashboardIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LayoutDashboardIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the layout dashboard icon.
 */
export const Default: Story = {};
