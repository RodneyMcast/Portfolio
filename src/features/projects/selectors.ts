import { createSelector } from '@reduxjs/toolkit';

import type { Project } from './types';
import type { RootState } from '../../app/store';

export const selectAllProjects = (state: RootState): Project[] => state.projects.entities;

export const selectProjectById =
  (projectId: string) =>
  (state: RootState): Project | undefined =>
    state.projects.entities.find((project) => project.id === projectId);

const selectFilters = (state: RootState) => state.projects.filters;

export const selectFilteredProjects = createSelector(
  [selectAllProjects, selectFilters],
  (projects, filters) => {
    const search = filters.searchQuery.trim().toLowerCase();

    let filtered = projects;

    if (filters.activeCategory !== 'all') {
      filtered = filtered.filter((project) => project.category === filters.activeCategory);
    }

    if (search) {
      filtered = filtered.filter((project) => {
        const haystack = [project.title, project.description, project.techStack.join(' ')]
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    const sorted = [...filtered];
    if (filters.sortMode === 'recent') {
      sorted.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'en-US'));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'en-US'));
    }

    return sorted;
  },
);
