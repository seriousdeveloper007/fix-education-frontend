import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import GoogleLogin from './components/LoginPage';
import ErrorPage from './components/ErrorPage';
import VerifyLearner from './components/VerifyLearner';
import Library from './components/Library';
import StudyRoom from './components/StudyRoom'; 
import LibraryDetail from './components/LibraryDetail'; 
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

      {/* Single Protected PlatformLanding Route */}
      {/* <Route
        path="/platform"
        element={
          <PrivateRoute>
            <PlatformLanding />
          </PrivateRoute>
        }
      /> */}

      <Route
        path="/study-room"
        element={<StudyRoom />}
      />

      <Route
        path="/library"
        element={
          <PrivateRoute>
            <Library />
          </PrivateRoute>
        }
      />

      <Route
        path="/library/:tabId"
        element={
          <PrivateRoute>
            <LibraryDetail />
          </PrivateRoute>
        }
      />

      {/* Public Routes */}
      <Route path="/verify-learner" element={<VerifyLearner />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/error" element={<ErrorPage />} />

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
