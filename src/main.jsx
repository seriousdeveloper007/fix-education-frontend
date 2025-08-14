// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { PostHogProvider } from 'posthog-js/react';
// import App from './App.jsx';
// import './index.css';


// const options = {
//   api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
//   defaults: '2025-05-24',
// }


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={options}>
//       <App />
//     </PostHogProvider>
//   </StrictMode>,
// );


// main.tsx
import { createRoot } from 'react-dom/client';
import { PostHogProvider } from 'posthog-js/react';
import App from './App.jsx';
import './index.css';

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
