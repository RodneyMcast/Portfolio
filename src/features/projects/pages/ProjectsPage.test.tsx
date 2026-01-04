import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../test/testUtils';

import ProjectsPage from './ProjectsPage';

import type { RootState } from '../../../app/store';
import type { Project } from '../types';

const projects: Project[] = [
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
  {
    id: 'project-3',
    title: 'Web Gamma',
    description: 'Another web project',
    longDescription: 'Long web project',
    year: 2022,
    category: 'web',
    techStack: ['TypeScript'],
    imageUrl: '/images/project-placeholder.svg',
    liveUrl: '',
    repoUrl: '',
  },
];

const preloadedState: Partial<RootState> = {
  ui: { themeMode: 'dark' },
  projects: {
    entities: projects,
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

describe('ProjectsPage filters', () => {
  it('filters by category and search text', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ProjectsPage />, {
      preloadedState,
      route: '/projects',
    });

    expect(screen.getByText('Web Alpha')).toBeInTheDocument();
    expect(screen.getByText('Mobile Beta')).toBeInTheDocument();
    expect(screen.getByText('Web Gamma')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Web' }));

    expect(screen.getByText('Web Alpha')).toBeInTheDocument();
    expect(screen.getByText('Web Gamma')).toBeInTheDocument();
    expect(screen.queryByText('Mobile Beta')).not.toBeInTheDocument();

    const searchBox = screen.getByRole('searchbox');
    await user.clear(searchBox);
    await user.type(searchBox, 'gamma');

    await waitFor(() => {
      expect(screen.getByText('Web Gamma')).toBeInTheDocument();
      expect(screen.queryByText('Web Alpha')).not.toBeInTheDocument();
    });
  });
});
