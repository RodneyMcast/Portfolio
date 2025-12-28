import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import projectsReducer from "../features/projects/projectsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
