import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import GoogleLogin from './components/LoginPage';
import Workspace from './components/Workspace';
import ErrorPage from './components/ErrorPage';
import VerifyLearner from './components/VerifyLearner';


export default function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <AppRoutes theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

// Utility to check auth
const isLoggedIn = () => Boolean(localStorage.getItem('token'));

// Protected route wrapper
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function AppRoutes({ theme, toggleTheme }) {
  return (
    <Routes>
      {/* Landing page for not-logged-in users */}
      <Route
        path="/"
        element={
          isLoggedIn() ? (
            <Navigate to="/platform" replace />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Login route */}
      <Route
        path="/login"
        element={
          isLoggedIn() ? (
            <Navigate to="/platform" replace />
          ) : (
            <GoogleLogin />
          )
        }
      />

      {/* Protected platform route */}
      <Route
        path="/platform/*"
        element={
          <PrivateRoute>
            <Workspace theme={theme} toggleTheme={toggleTheme} />
          </PrivateRoute>
        }
      />

      {/* Public info routes */}
      <Route path="/verify-learner" element={<VerifyLearner />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/error" element={<ErrorPage />} />

      {/* Fallback */}
      <Route path="*" element={<p>404 Not Found</p>} />
    </Routes>
  );
}
