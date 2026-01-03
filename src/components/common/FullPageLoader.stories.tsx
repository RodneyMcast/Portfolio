import type { Meta, StoryObj } from "@storybook/react";
import { FullPageLoader } from "./FullPageLoader";

const meta: Meta<typeof FullPageLoader> = {
  title: "Common/FullPageLoader",
  component: FullPageLoader,
};

export default meta;
type Story = StoryObj<typeof FullPageLoader>;

export const Default: Story = {};

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: "Light" },
    preloadedState: { ui: { themeMode: "light" } },
  },
};
