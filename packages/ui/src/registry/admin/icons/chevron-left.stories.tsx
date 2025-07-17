import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronLeftIcon } from "./chevron-left";

/**
 * The chevron-left icon.
 */
const meta = {
  title: "registry/admin/icons/ChevronLeft",
  component: ChevronLeftIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ChevronLeftIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChevronLeftIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the chevron-left icon.
 */
export const Default: Story = {};
