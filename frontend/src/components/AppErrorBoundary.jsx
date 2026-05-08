import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  componentDidCatch(error) {
    // Keep this log to make browser-debugging easier.
    console.error('App crashed:', error);
  }

  render() {
    const { hasError, message } = this.state;
    const { children } = this.props;

    if (!hasError) return children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#05060b] text-white">
        <div className="max-w-xl w-full border border-rose-400/30 bg-rose-500/10 rounded-2xl p-6">
          <h1 className="text-xl font-semibold mb-2">Frontend Runtime Error</h1>
          <p className="text-sm text-rose-100/90 mb-4">
            A component crashed during rendering. The app was stopped safely.
          </p>
          <pre className="text-xs whitespace-pre-wrap break-words text-rose-100/80">
            {message}
          </pre>
        </div>
      </div>
    );
  }
}
