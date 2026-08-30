import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-8 max-w-md">
            <h2 className="font-display text-2xl tracking-[0.04em] text-[var(--text-primary)]">
              Algo salió mal
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Ocurrió un error inesperado. Por favor, intenta de nuevo.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)] transition hover:bg-[var(--accent-strong)]"
              >
                Reintentar
              </button>
              <Link
                to="/"
                className="rounded-full border border-[var(--border-soft)] bg-[rgba(255,255,255,0.4)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
