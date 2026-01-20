import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './App';
import { store } from './app/store';
import './styles/tokens.css';
import './styles/globals.css';

// Root mount point from index.html.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* Redux provider gives access to state across the app. */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
