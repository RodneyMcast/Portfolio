import { configureStore } from '@reduxjs/toolkit';

import contactReducer from '../features/contact/contactSlice';
import projectsReducer from '../features/projects/projectsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    projects: projectsReducer,
    contact: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
