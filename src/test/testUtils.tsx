import type { PreloadedState } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import type { RootState } from "../app/store";
import contactReducer from "../features/contact/contactSlice";
import projectsReducer from "../features/projects/projectsSlice";
import uiReducer from "../features/ui/uiSlice";

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: {
      ui: uiReducer,
      projects: projectsReducer,
      contact: contactReducer,
    },
    preloadedState,
  });

export type AppStore = ReturnType<typeof setupStore>;

type ExtendedRenderOptions = Omit<RenderOptions, "queries"> & {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  route?: string;
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    route = "/",
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};
