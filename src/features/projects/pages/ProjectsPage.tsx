import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { FilterPills, type FilterOption } from '../components/FilterPills';
import { ProjectGrid } from '../components/ProjectGrid';
import { ProjectsHero } from '../components/ProjectsHero';
import { SearchBar } from '../components/SearchBar';
import { SortControl } from '../components/SortControl';
import { fetchProjects, setCategory, setSearchQuery, setSortMode } from '../projectsSlice';
import { selectFilteredProjects } from '../selectors';

import type { ProjectFilterCategory, ProjectSortMode } from '../types';

const filterOptions: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'games', label: 'Games' },
  { value: 'api', label: 'API' },
];

const ProjectsPage = () => {
  const dispatch = useAppDispatch();
  // Read everything from Redux so filters survive navigation.
  const status = useAppSelector((state) => state.projects.status);
  const error = useAppSelector((state) => state.projects.error);
  const searchQuery = useAppSelector((state) => state.projects.filters.searchQuery);
  const activeCategory = useAppSelector((state) => state.projects.filters.activeCategory);
  const sortMode = useAppSelector((state) => state.projects.filters.sortMode);
  // Memoized selector avoids extra filtering work.
  const projects = useAppSelector(selectFilteredProjects);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [animationKey, setAnimationKey] = useState(0);

  // Fetch only once on first visit.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  // Keep local input state in sync with Redux.
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Simple key to retrigger the grid animation.
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [activeCategory, searchQuery, sortMode]);

  // Debounce search updates so typing feels smoother.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== searchQuery) {
        dispatch(setSearchQuery(searchValue));
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, searchValue]);

  // Handlers are memoized to avoid extra renders.
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleFilterChange = useCallback(
    (value: ProjectFilterCategory) => {
      dispatch(setCategory(value));
    },
    [dispatch],
  );

  const handleSortChange = useCallback(
    (value: ProjectSortMode) => {
      dispatch(setSortMode(value));
    },
    [dispatch],
  );

  const handleRetry = useCallback(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="projects-page">
      <ProjectsHero
        heading="Featured"
        accent="Projects"
        summary="A few class and personal builds to show the flow."
      />
      <div className="projects-controls">
        <SearchBar value={searchValue} onChange={handleSearchChange} />
        <div className="projects-filters">
          <FilterPills
            options={filterOptions}
            active={activeCategory}
            onChange={handleFilterChange}
          />
          <SortControl value={sortMode} onChange={handleSortChange} />
        </div>
        <p className="projects-count">Showing {projects.length} projects</p>
      </div>
      <ProjectGrid
        projects={projects}
        status={status}
        error={error}
        onRetry={handleRetry}
        animationKey={animationKey}
      />
    </div>
  );
};

export default ProjectsPage;
