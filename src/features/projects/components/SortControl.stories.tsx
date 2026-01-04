import { SortControl } from './SortControl';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SortControl> = {
  title: 'Projects/SortControl',
  component: SortControl,
  argTypes: {
    value: {
      control: 'select',
      options: ['recent', 'name'],
    },
    disabled: { control: 'boolean' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<typeof SortControl>;

export const Default: Story = {
  args: {
    value: 'recent',
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Active: Story = {
  args: {
    value: 'name',
  },
};

export const Disabled: Story = {
  args: {
    value: 'recent',
    disabled: true,
  },
};

export const HoverPreview: Story = {
  args: {
    value: 'recent',
  },
  render: (args) => (
    <div className="story-hover sort-hover">
      <style>{`
        .sort-hover .sort-control select {
          border-color: var(--color-border-strong);
          box-shadow: 0 0 12px var(--color-glow-soft);
        }
      `}</style>
      <SortControl {...args} />
    </div>
  ),
};
