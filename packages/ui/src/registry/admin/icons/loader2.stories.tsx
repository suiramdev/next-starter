import type { Meta, StoryObj } from "@storybook/react";
import { Loader2Icon } from "./loader2";

/**
 * The loader2 icon.
 */
const meta = {
  title: "registry/admin/icons/Loader2",
  component: Loader2Icon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <Loader2Icon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Loader2Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the loader2 icon.
 */
export const Default: Story = {};
