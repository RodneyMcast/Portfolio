import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import ProjectsPage from '../../features/projects/pages/ProjectsPage';
import { HomePage } from '../../pages/HomePage';
import { renderWithProviders } from '../../test/testUtils';

import { AppLayout } from './AppLayout';

import type { RootState } from '../../app/store';

const preloadedState: Partial<RootState> = {
  ui: { themeMode: 'dark' },
  projects: {
    entities: [
      {
        id: 'project-1',
        title: 'Web Alpha',
        description: 'Web project',
        longDescription: 'Long web project',
        year: 2024,
        category: 'web',
        techStack: ['React'],
        imageUrl: '/images/project-placeholder.svg',
        liveUrl: '',
        repoUrl: '',
      },
      {
        id: 'project-2',
        title: 'Mobile Beta',
        description: 'Mobile project',
        longDescription: 'Long mobile project',
        year: 2023,
        category: 'mobile',
        techStack: ['React Native'],
        imageUrl: '/images/project-placeholder.svg',
        liveUrl: '',
        repoUrl: '',
      },
    ],
    status: 'succeeded',
    error: null,
    filters: {
      activeCategory: 'all',
      searchQuery: '',
      sortMode: 'recent',
    },
  },
  contact: {
    fields: { name: '', email: '', subject: '', message: '' },
    errors: { name: null, email: null, subject: null, message: null },
    status: 'idle',
    errorMessage: null,
  },
};

describe('Navbar navigation', () => {
  it('navigates to the projects page', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>
      </Routes>,
      { route: '/', preloadedState },
    );

    const projectsLink = screen.getByRole('link', { name: 'Projects' });
    await user.click(projectsLink);

    expect(await screen.findByRole('heading', { name: /Featured Projects/i })).toBeInTheDocument();
    expect(projectsLink).toHaveClass('is-active');
  });
});
