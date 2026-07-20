import { withReduxStore, withTheme } from '../storybook/decorators';

import AdminPage from './AdminPage';

import type { Meta, StoryObj } from '@storybook/react';

const unlockAdmin = () => {
  window.sessionStorage.setItem('portfolio.adminUnlocked', 'true');
};

const meta: Meta<typeof AdminPage> = {
  title: 'Pages/AdminPage',
  component: AdminPage,
  decorators: [withReduxStore(), withTheme()],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive preview of the live admin dashboard. The story unlocks the real page, so you can test editing, saving, and the work history ordering in Storybook.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AdminPage>;

export const Locked: Story = {
  render: () => {
    window.sessionStorage.removeItem('portfolio.adminUnlocked');
    return <AdminPage />;
  },
};

export const UnlockedDashboard: Story = {
  render: () => {
    unlockAdmin();
    return <AdminPage />;
  },
};
