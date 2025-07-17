import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRightIcon } from "./chevron-right";

/**
 * The chevron-right icon.
 */
const meta = {
  title: "registry/admin/icons/ChevronRight",
  component: ChevronRightIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ChevronRightIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChevronRightIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the chevron-right icon.
 */
export const Default: Story = {};
