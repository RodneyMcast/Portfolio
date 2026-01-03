import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary } from "./ErrorBoundary";

const Crash = () => {
  throw new Error("Story crash");
};

const meta: Meta<typeof ErrorBoundary> = {
  title: "Common/ErrorBoundary",
  component: ErrorBoundary,
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const GenericError: Story = {
  render: () => (
    <ErrorBoundary>
      <Crash />
    </ErrorBoundary>
  ),
};

export const WithReloadButton: Story = {
  render: () => (
    <ErrorBoundary>
      <Crash />
    </ErrorBoundary>
  ),
  parameters: {
    backgrounds: { default: "Light" },
    preloadedState: { ui: { themeMode: "light" } },
  },
};
