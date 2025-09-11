import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import { PostHogProvider } from 'posthog-js/react';
import App from './App.jsx';
import './index.css';

// ADD THESE LINES - Expose React for dynamic modules
window.React = React;
window.ReactDOM = ReactDOM;
window.ReactJSXRuntime = ReactJSXRuntime;

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
    <App />
  </PostHogProvider>
);