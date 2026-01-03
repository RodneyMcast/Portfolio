import type { Decorator } from "@storybook/react";
import { configureStore } from "@reduxjs/toolkit";
import type { ReactNode } from "react";
import { useContext, useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider, ReactReduxContext } from "react-redux";
import type { RootState } from "../app/store";
import type { ThemeMode } from "../features/ui/uiSlice";
import contactReducer from "../features/contact/contactSlice";
import projectsReducer from "../features/projects/projectsSlice";
import uiReducer from "../features/ui/uiSlice";

const createStoryStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: {
      ui: uiReducer,
      projects: projectsReducer,
      contact: contactReducer,
    },
    preloadedState,
  });

const ThemeSync = ({
  fallback,
  children,
}: {
  fallback: ThemeMode;
  children: ReactNode;
}) => {
  const reduxContext = useContext(ReactReduxContext);

  useEffect(() => {
    if (!reduxContext) {
      document.documentElement.setAttribute("data-theme", fallback);
      return;
    }

    const updateTheme = () => {
      const state = reduxContext.store.getState() as RootState;
      document.documentElement.setAttribute("data-theme", state.ui.themeMode);
    };

    updateTheme();
    const unsubscribe = reduxContext.store.subscribe(updateTheme);
    return () => unsubscribe();
  }, [reduxContext, fallback]);

  return <>{children}</>;
};

export const withMemoryRouter =
  (initialRoute = "/"): Decorator =>
  (Story, context) => {
    const routeFromParams =
      (context.parameters?.initialRoute as string | undefined) ??
      (context.parameters?.route as string | undefined);
    const route = routeFromParams ?? initialRoute;

    return (
      <MemoryRouter initialEntries={[route]}>
        <Story />
      </MemoryRouter>
    );
  };

export const withReduxStore =
  (preloadedState?: Partial<RootState>): Decorator =>
  (Story, context) => {
    const stateFromParams = context.parameters?.preloadedState as
      | Partial<RootState>
      | undefined;
    const store = createStoryStore(stateFromParams ?? preloadedState);

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  };

export const withTheme =
  (defaultTheme: ThemeMode = "dark"): Decorator =>
  (Story, context) => {
    const themeFromParams = context.parameters?.themeMode as ThemeMode | undefined;
    const themeMode = themeFromParams ?? defaultTheme;

    return (
      <ThemeSync fallback={themeMode}>
        <Story />
      </ThemeSync>
    );
  };
