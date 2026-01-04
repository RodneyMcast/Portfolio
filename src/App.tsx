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

const ProjectsPage = lazy(() => import('./features/projects/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./features/projects/pages/ProjectDetailPage'));

export const App = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<FullPageLoader />}>
                  <ProjectsPage />
                </Suspense>
              }
            />
            <Route
              path=":projectId"
              element={
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
