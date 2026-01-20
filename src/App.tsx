import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { FullPageLoader } from './components/common/FullPageLoader';
import { AppLayout } from './components/layout/AppLayout';
import { ProjectsLayout } from './features/projects/pages/ProjectsLayout';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Code-split the heavier project pages so they load only when needed.
const ProjectsPage = lazy(() => import('./features/projects/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./features/projects/pages/ProjectDetailPage'));

export const App = () => (
  // BrowserRouter owns the URL-based navigation.
  <BrowserRouter>
    {/* Catch render errors so the whole app does not crash. */}
    <ErrorBoundary>
      {/* Nested routes let the layout wrap all pages. */}
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsLayout />}>
            <Route
              index
              element={
                // Suspense shows a loader while the lazy page chunk loads.
                <Suspense fallback={<FullPageLoader />}>
                  <ProjectsPage />
                </Suspense>
              }
            />
            <Route
              path=":projectId"
              element={
                // Detail page is also lazy-loaded for faster initial load.
                <Suspense fallback={<FullPageLoader />}>
                  <ProjectDetailPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
);
