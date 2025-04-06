import * as React from 'react';

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error caught by ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div>Error</div>;
    }

    return this.props.children;
  }
}

const ErrorBoundary = ({ children }) => {
  return (
    <>
      {import.meta.env.DEV ? (
        <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
      ) : (
        children
      )}
    </>
  );
};

export default ErrorBoundary;
