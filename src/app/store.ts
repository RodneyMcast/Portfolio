import { configureStore } from '@reduxjs/toolkit';

import contactReducer from '../features/contact/contactSlice';
import projectsReducer from '../features/projects/projectsSlice';
import uiReducer from '../features/ui/uiSlice';

// Single Redux store shared across the app.
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    projects: projectsReducer,
    contact: contactReducer,
  },
});

// Typed helpers keep dispatch/selectors safe in TS.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
