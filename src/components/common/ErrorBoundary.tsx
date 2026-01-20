import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  forceError?: boolean;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

// Catches render errors and shows a fallback UI.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  // React runs this when a child throws during render.
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Log the error for debugging.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  // Simple reload for recovery.
  handleReload = () => {
    window.location.reload();
  };

  render() {
    // forceError is used only in Storybook to show the fallback.
    if (this.state.hasError || this.props.forceError) {
      return (
        <main className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>Try reloading the page.</p>
          <button type="button" onClick={this.handleReload}>
            Reload
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
