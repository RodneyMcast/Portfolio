import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useApplyTheme } from "./app/hooks";
import { fetchProjects } from "./features/projects/projectsSlice";

export const App = () => {
  useApplyTheme();

  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const status = useAppSelector((state) => state.projects.status);
  const projectCount = useAppSelector((state) => state.projects.entities.length);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  return (
    <main className="app">
      <span className="eyebrow">Portfolio Foundation</span>
      <h1>Redux Toolkit Core Ready</h1>
      <p>
        Theme: {themeMode} · Projects: {projectCount} · Status: {status}
      </p>
    </main>
  );
};
