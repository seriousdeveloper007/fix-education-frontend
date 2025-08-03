import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import PlatformLanding from './components/PlatformLanding';
import GoogleLogin from './components/LoginPage';
import ErrorPage from './components/ErrorPage';
import VerifyLearner from './components/VerifyLearner';
import StudyRoom from './components/StudyRoom.jsx';
import Library from './components/Library';


export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

// A wrapper for private routes
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirects based on login status */}
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

      {/* Login */}
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

      {/* Single Protected PlatformLanding Route */}
      <Route
        path="/platform"
        element={
          <PrivateRoute>
            <PlatformLanding />
          </PrivateRoute>
        }
      />

      <Route
        path="/study-room"
        element={
          <PrivateRoute>
            <StudyRoom />
          </PrivateRoute>
        }
      />

      <Route
        path="/library"
        element={
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/verify-learner" element={<VerifyLearner />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/error" element={<ErrorPage />} />

      {/* Fallback */}
      <Route
        path="*"
        element={
          isLoggedIn() ? (
            <Navigate to="/platform" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
