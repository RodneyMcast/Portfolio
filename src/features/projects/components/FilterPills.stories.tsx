import { FilterPills } from './FilterPills';

import type { FilterOption } from './FilterPills';
import type { Meta, StoryObj } from '@storybook/react';

const options: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'games', label: 'Games' },
  { value: 'api', label: 'API' },
];

const meta: Meta<typeof FilterPills> = {
  title: 'Projects/FilterPills',
  component: FilterPills,
  argTypes: {
    active: {
      control: 'select',
      options: options.map((option) => option.value),
    },
    disabled: { control: 'boolean' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<typeof FilterPills>;

export const Default: Story = {
  args: {
    options,
    active: 'all',
  },
};

export const Active: Story = {
  args: {
    options,
    active: 'web',
  },
};

export const Disabled: Story = {
  args: {
    options,
    active: 'all',
    disabled: true,
  },
};

export const HoverPreview: Story = {
  args: {
    options,
    active: 'all',
  },
  render: (args) => (
    <div className="story-hover filter-hover">
      <style>{`
        .filter-hover .pill {
          border-color: var(--color-border-strong);
          box-shadow: 0 0 12px var(--color-glow-soft);
        }
      `}</style>
      <FilterPills {...args} />
    </div>
  ),
};

export const ManyCategories: Story = {
  args: {
    options: [
      { value: 'all', label: 'All Projects' },
      { value: 'web', label: 'Web Apps' },
      { value: 'mobile', label: 'Mobile Builds' },
      { value: 'games', label: 'Games & Unity' },
      { value: 'api', label: 'API Services' },
    ],
    active: 'mobile',
  },
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};
