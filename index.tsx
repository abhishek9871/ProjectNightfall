import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppRouter } from './AppRouter';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const app = (
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

// Check if the container has been pre-rendered
if (rootElement.hasChildNodes()) {
  // Hydrate pre-rendered content
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  // Regular client-side rendering for development
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}
