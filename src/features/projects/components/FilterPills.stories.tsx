import type { Meta, StoryObj } from "@storybook/react";
import { FilterPills } from "./FilterPills";
import type { FilterOption } from "./FilterPills";

const options: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "games", label: "Games" },
  { value: "api", label: "API" },
];

const meta: Meta<typeof FilterPills> = {
  title: "Projects/FilterPills",
  component: FilterPills,
  argTypes: {
    active: {
      control: "select",
      options: options.map((option) => option.value),
    },
    onChange: { action: "onChange" },
  },
};

export default meta;
type Story = StoryObj<typeof FilterPills>;

export const AllActive: Story = {
  args: {
    options,
    active: "all",
  },
};

export const WebActive: Story = {
  args: {
    options,
    active: "web",
  },
};

export const ManyCategories: Story = {
  args: {
    options: [
      { value: "all", label: "All Projects" },
      { value: "web", label: "Web Apps" },
      { value: "mobile", label: "Mobile Builds" },
      { value: "games", label: "Games & Unity" },
      { value: "api", label: "API Services" },
    ],
    active: "mobile",
  },
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
