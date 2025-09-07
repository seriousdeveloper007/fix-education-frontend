import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// import LandingPage from './components/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GoogleLogin from './pages/LoginPage';
import ChatRoadmap from './pages/ChatRoadmap';


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
// eslint-disable-next-line react/prop-types
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
            <Navigate to="/roadmap" replace />
          ) : (
            // <LandingPage />
            <ChatRoadmap />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          isLoggedIn() ? (
            <Navigate to="/roadmap" replace />
          ) : (
            <GoogleLogin />
          )
        }
      />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route
        path="/roadmap"
        element={<ChatRoadmap />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          isLoggedIn() ? (
            <Navigate to="/roadmap" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
