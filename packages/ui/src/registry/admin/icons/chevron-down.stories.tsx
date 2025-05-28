import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDownIcon } from "./chevron-down";

/**
 * The chevron-down icon.
 */
const meta = {
  title: "registry/admin/icons/ChevronDown",
  component: ChevronDownIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ChevronDownIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChevronDownIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the chevron-down icon.
 */
export const Default: Story = {};
