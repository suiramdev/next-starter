import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsLeftIcon } from "./chevrons-left";

/**
 * The chevrons-left icon.
 */
const meta = {
  title: "registry/admin/icons/ChevronsLeft",
  component: ChevronsLeftIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ChevronsLeftIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChevronsLeftIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the chevrons-left icon.
 */
export const Default: Story = {};
