import type { Meta, StoryObj } from "@storybook/react";
import { SortControl } from "./SortControl";

const meta: Meta<typeof SortControl> = {
  title: "Projects/SortControl",
  component: SortControl,
  argTypes: {
    value: {
      control: "select",
      options: ["recent", "name"],
    },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SortControl>;

export const SortByRecent: Story = {
  args: {
    value: "recent",
  },
};

export const SortByName: Story = {
  args: {
    value: "name",
  },
};

export const MobileView: Story = {
  args: {
    value: "recent",
  },
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
