import type { Meta, StoryObj } from "@storybook/react";
import { ColumnsIcon } from "./columns";

/**
 * The columns icon.
 */
const meta = {
  title: "registry/admin/icons/Columns",
  component: ColumnsIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <ColumnsIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ColumnsIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the columns icon.
 */
export const Default: Story = {};
