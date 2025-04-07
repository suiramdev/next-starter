import type { Meta, StoryObj } from "@storybook/react";

import { SettingsIcon } from "./settings";

/**
 * The settings icon.
 */
const meta = {
  title: "registry/admin/icons/Settings",
  component: SettingsIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <SettingsIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SettingsIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the layout dashboard icon.
 */
export const Default: Story = {};
