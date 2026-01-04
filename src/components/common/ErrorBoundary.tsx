import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  forceError?: boolean;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
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
