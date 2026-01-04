import { SearchBar } from './SearchBar';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchBar> = {
  title: 'Projects/SearchBar',
  component: SearchBar,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Search projects...',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};

export const Filled: Story = {
  args: {
    value: 'helix',
  },
};

export const Disabled: Story = {
  args: {
    value: 'disabled',
    disabled: true,
  },
};

export const HoverPreview: Story = {
  args: {
    value: 'hover state',
  },
  render: (args) => (
    <div className="story-hover searchbar-hover">
      <style>{`
        .searchbar-hover .search-bar input {
          border-color: var(--color-border-strong);
          box-shadow: 0 0 0 4px var(--color-focus-shadow);
        }
      `}</style>
      <SearchBar {...args} />
    </div>
  ),
};
