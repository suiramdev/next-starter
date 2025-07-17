import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoaderIcon } from "./loader";

/**
 * The loader icon.
 */
const meta = {
  title: "registry/admin/icons/Loader",
  component: LoaderIcon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <LoaderIcon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LoaderIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the loader icon.
 */
export const Default: Story = {};
