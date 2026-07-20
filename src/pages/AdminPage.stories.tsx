import { withReduxStore, withTheme } from '../storybook/decorators';

import AdminPage from './AdminPage';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AdminPage> = {
  title: 'Pages/AdminPage',
  component: AdminPage,
  decorators: [withReduxStore(), withTheme()],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive preview of the live admin dashboard. The story shows the Firebase Auth gate and the editor layout so you can inspect the admin flow in Storybook.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdminPage>;

export const Locked: Story = {
  render: () => <AdminPage />,
};

export const UnlockedDashboard: Story = {
  render: () => <AdminPage />,
};
