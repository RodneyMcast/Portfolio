import { withMemoryRouter } from '../../storybook/decorators';

import { Navbar } from './Navbar';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  decorators: [withMemoryRouter('/')],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const HomeActive: Story = {};

export const ProjectsActive: Story = {
  parameters: {
    initialRoute: '/projects',
    viewport: { defaultViewport: 'mobile' },
  },
};
