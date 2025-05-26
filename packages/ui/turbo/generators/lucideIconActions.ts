import type { PlopTypes } from "@turbo/gen";

export const lucideIconActions: PlopTypes.ActionType[] = [
  // Icon component
  {
    type: "add",
    path: "src/registry/{{registry}}/icons/{{dashCase iconName}}.tsx",
    template: `import { {{iconName}}, LucideProps } from "lucide-react";

export function {{iconName}}Icon({ ...props }: LucideProps) {
  return <{{iconName}} {...props} />;
}
`,
    force: false,
  },
  // Storybook story
  {
    type: "add",
    path: "src/registry/{{registry}}/icons/{{dashCase iconName}}.stories.tsx",
    template: `import type { Meta, StoryObj } from "@storybook/react";
import { {{iconName}}Icon } from "./{{dashCase iconName}}";

/**
 * The {{dashCase iconName}} icon.
 */
const meta = {
  title: "registry/{{registry}}/icons/{{iconName}}",
  component: {{iconName}}Icon,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => <{{iconName}}Icon {...args} />,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof {{iconName}}Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the {{dashCase iconName}} icon.
 */
export const Default: Story = {};
`,
    force: false,
  },
];
