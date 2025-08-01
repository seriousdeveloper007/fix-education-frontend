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


import Platform from './components/Platform';

import GoogleLogin from './components/LoginPage';


import ErrorPage from './components/ErrorPage';
import VerifyLearner from './components/VerifyLearner';


export default function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


function AppRoutes() {
  const isLoggedIn = () => Boolean(localStorage.getItem('token'));
  
  const location = useLocation();
  const isPlatform = location.pathname.startsWith('/platform');


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
          path="platform/*"
          element={<Platform  />}
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
