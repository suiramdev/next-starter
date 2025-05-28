import type { Meta, StoryObj } from "@storybook/react";
import { ChevronsRightIcon } from "./chevrons-right";

/**
 * The chevrons-right icon.
 */
const meta = {
  title: "registry/admin/icons/ChevronsRight",
  component: ChevronsRightIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ChevronsRightIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChevronsRightIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the chevrons-right icon.
 */
export const Default: Story = {};
