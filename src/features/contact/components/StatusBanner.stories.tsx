import type { Meta, StoryObj } from "@storybook/react";
import { StatusBanner } from "./StatusBanner";

const meta: Meta<typeof StatusBanner> = {
  title: "Contact/StatusBanner",
  component: StatusBanner,
  argTypes: {
    onAction: { action: "onAction" },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBanner>;

export const Success: Story = {
  args: {
    tone: "success",
    message: "Message sent. I'll get back to you soon.",
  },
};

export const Error: Story = {
  args: {
    tone: "error",
    message: "Something went wrong. Please try again.",
    actionLabel: "Try again",
  },
};

export const ActionOnly: Story = {
  args: {
    tone: "error",
    message: "Unable to send right now.",
    actionLabel: "Retry",
  },
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
