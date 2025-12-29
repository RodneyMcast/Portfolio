import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project, ProjectFilterCategory, ProjectSortMode } from "./types";
import projectsData from "../../data/projects.json";

interface ProjectsState {
  entities: Project[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: {
    activeCategory: ProjectFilterCategory;
    searchQuery: string;
    sortMode: ProjectSortMode;
  };
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const waitMs = 250 + Math.floor(Math.random() * 151);
    await delay(waitMs);
    return projectsData as Project[];
  } catch {
    return rejectWithValue("Failed to load projects.");
  }
});

const initialState: ProjectsState = {
  entities: [],
  status: "idle",
  error: null,
  filters: {
    activeCategory: "all",
    searchQuery: "",
    sortMode: "recent",
  },
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
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
      state.filters.activeCategory = "all";
      state.filters.searchQuery = "";
      state.filters.sortMode = "recent";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load projects.";
      });
  },
});

export const { setCategory, setSearchQuery, setSortMode, clearFilters } =
  projectsSlice.actions;
export default projectsSlice.reducer;
