"use client";

import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary-fallback p-4 bg-white rounded shadow my-4">
          <h3 className="text-danger mb-3">Something went wrong</h3>
          {this.props.errorMessage ? (
            <p>{this.props.errorMessage}</p>
          ) : (
            <p>We're experiencing some technical issues. Please try refreshing the page.</p>
          )}
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
