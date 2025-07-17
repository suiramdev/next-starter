import type { Meta, StoryObj } from "@storybook/react-vite";
import { BanIcon } from "./ban";

/**
 * The ban icon.
 */
const meta = {
  title: "registry/admin/icons/Ban",
  component: BanIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <BanIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BanIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the ban icon.
 */
export const Default: Story = {};
