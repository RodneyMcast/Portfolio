import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Projects/SearchBar",
  component: SearchBar,
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: {
    value: "",
    placeholder: "Search projects...",
  },
};

export const WithValue: Story = {
  args: {
    value: "helix",
  },
};

export const Disabled: Story = {
  args: {
    value: "disabled",
  },
  render: (args) => (
    <label className="search-bar">
      <span className="sr-only">Search projects</span>
      <input
        type="search"
        value={args.value}
        placeholder={args.placeholder}
        disabled
        onChange={() => {}}
      />
    </label>
  ),
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
