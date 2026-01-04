import { ErrorBoundary } from './ErrorBoundary';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Common/ErrorBoundary',
  component: ErrorBoundary,
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const GenericError: Story = {
  args: {
    forceError: true,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <div />
    </ErrorBoundary>
  ),
};

export const WithReloadButton: Story = {
  args: {
    forceError: true,
  },
  render: (args) => (
    <ErrorBoundary {...args}>
      <div />
    </ErrorBoundary>
  ),
  parameters: {
    backgrounds: { default: 'Light' },
    preloadedState: { ui: { themeMode: 'light' } },
  },
};
