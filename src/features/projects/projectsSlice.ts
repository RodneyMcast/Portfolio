import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import projectsData from '../../data/projects.json';

import type { Project, ProjectFilterCategory, ProjectSortMode } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProjectsState {
  entities: Project[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    activeCategory: ProjectFilterCategory;
    searchQuery: string;
    sortMode: ProjectSortMode;
  };
}

// Small helper to fake loading time for a nicer demo.
const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

// Fetch data from local JSON and simulate async loading.
export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const waitMs = 250 + Math.floor(Math.random() * 151);
      await delay(waitMs);
      return projectsData as Project[];
    } catch {
      return rejectWithValue('Failed to load projects.');
    }
  },
);

// Start empty and let the page request data on mount.
const initialState: ProjectsState = {
  entities: [],
  status: 'idle',
  error: null,
  filters: {
    activeCategory: 'all',
    searchQuery: '',
    sortMode: 'recent',
  },
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Filter state lives in Redux so it survives navigation.
    setCategory(state, action: PayloadAction<ProjectFilterCategory>) {
      state.filters.activeCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.searchQuery = action.payload;
    },
    setSortMode(state, action: PayloadAction<ProjectSortMode>) {
      state.filters.sortMode = action.payload;
    },
    clearFilters(state) {
      state.filters.activeCategory = 'all';
      state.filters.searchQuery = '';
      state.filters.sortMode = 'recent';
    },
  },
  extraReducers: (builder) => {
    // Track async status so UI can show loading or error states.
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load projects.';
      });
  },
});

export const { setCategory, setSearchQuery, setSortMode, clearFilters } = projectsSlice.actions;
export default projectsSlice.reducer;
