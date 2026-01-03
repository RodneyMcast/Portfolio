import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import projectsReducer from "../features/projects/projectsSlice";
import contactReducer from "../features/contact/contactSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    projects: projectsReducer,
    contact: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
