import { FullPageLoader } from './FullPageLoader';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FullPageLoader> = {
  title: 'Common/FullPageLoader',
  component: FullPageLoader,
};

export default meta;
type Story = StoryObj<typeof FullPageLoader>;

export const Default: Story = {};

export const Compact: Story = {
  render: () => (
    <div style={{ minHeight: '200px' }}>
      <FullPageLoader />
    </div>
  ),
};

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'Light' },
    preloadedState: { ui: { themeMode: 'light' } },
  },
};
