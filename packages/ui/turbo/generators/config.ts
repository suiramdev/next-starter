import type { PlopTypes } from "@turbo/gen";
import { lucideIconActions } from "./lucideIconActions";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("lucide-icon", {
    description:
      "Generate a Lucide icon component and its Storybook story in the chosen registry.",
    prompts: [
      {
        type: "list",
        name: "registry",
        message: "Which registry?",
        choices: ["admin", "new-york-v4"],
      },
      {
        type: "input",
        name: "iconName",
        message: "Lucide icon name (e.g. MoreHorizontal):",
        validate: (input: string) =>
          /^[A-Z][A-Za-z0-9]*$/.test(input)
            ? true
            : "Icon name should be PascalCase (e.g. MoreHorizontal)",
      },
    ],
    actions: lucideIconActions,
  });
}
