import { FormField } from './FormField';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FormField> = {
  title: 'Contact/FormField',
  component: FormField,
  argTypes: {
    onChange: { action: 'onChange' },
    multiline: { control: 'boolean' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    id: 'name',
    label: 'Name',
    value: '',
    error: null,
  },
};

export const Filled: Story = {
  args: {
    id: 'name',
    label: 'Name',
    value: 'Rodney Hili',
    error: null,
  },
};

export const WithError: Story = {
  args: {
    id: 'email',
    label: 'Email',
    value: 'rodney@',
    error: 'Enter a valid email address.',
    type: 'email',
  },
};

export const Disabled: Story = {
  args: {
    id: 'subject',
    label: 'Subject',
    value: 'Disabled field',
    error: null,
    disabled: true,
  },
};

export const HoverPreview: Story = {
  args: {
    id: 'message',
    label: 'Message',
    value: 'Hover state',
    error: null,
  },
  render: (args) => (
    <div className="story-hover field-hover">
      <style>{`
        .field-hover .form-field input,
        .field-hover .form-field textarea {
          border-color: var(--color-border-strong);
          box-shadow: 0 0 0 3px var(--color-focus-shadow);
        }
      `}</style>
      <FormField {...args} />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
};
