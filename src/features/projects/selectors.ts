import { createSelector } from '@reduxjs/toolkit';

import type { Project } from './types';
import type { RootState } from '../../app/store';

// Base selector for the full list.
export const selectAllProjects = (state: RootState): Project[] => state.projects.entities;

// Param selector used on detail pages.
export const selectProjectById =
  (projectId: string) =>
  (state: RootState): Project | undefined =>
    state.projects.entities.find((project) => project.id === projectId);

// Keep filters separate so createSelector can memoize.
const selectFilters = (state: RootState) => state.projects.filters;

// Derive filtered + sorted list once per input change.
export const selectFilteredProjects = createSelector(
  [selectAllProjects, selectFilters],
  (projects, filters) => {
    const search = filters.searchQuery.trim().toLowerCase();

    let filtered = projects;

    // Category filter is simple equality, "all" keeps everything.
    if (filters.activeCategory !== 'all') {
      filtered = filtered.filter((project) => project.category === filters.activeCategory);
    }

    // Search runs on title, short description, and tech stack.
    if (search) {
      filtered = filtered.filter((project) => {
        const haystack = [project.title, project.description, project.techStack.join(' ')]
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    // Sort uses a copy so we do not mutate state data.
    const sorted = [...filtered];
    if (filters.sortMode === 'recent') {
      sorted.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'en-US'));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'en-US'));
    }

    return sorted;
  },
);
