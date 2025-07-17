import type { Meta, StoryObj } from "@storybook/react-vite";
import { PencilIcon } from "./pencil";

/**
 * The pencil icon.
 */
const meta = {
  title: "registry/admin/icons/Pencil",
  component: PencilIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <PencilIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PencilIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the pencil icon.
 */
export const Default: Story = {};
