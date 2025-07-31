import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AudioRecorderProvider } from './components/AudioRecorderContext.jsx';
import './index.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AudioRecorderProvider>
      <App />
    </AudioRecorderProvider>
  </StrictMode>
);
