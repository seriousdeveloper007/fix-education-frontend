import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// import LandingPage from './components/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GoogleLogin from './pages/LoginPage';
import StartLearningPage from './pages/StartLearningPage';
import ShortLessonPage from './pages/ShortLessonPage';


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
            <Navigate to="/home" replace />
          ) : (
            // <LandingPage />
            <StartLearningPage />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          isLoggedIn() ? (
            <Navigate to="/home" replace />
          ) : (
            <GoogleLogin />
          )
        }
      />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route
        path="/home"
        element={<StartLearningPage />}
      />

      <Route path="/learn/:id/:miniLessonSlug" element={<ShortLessonPage />} />


      {/* Fallback */}
      <Route
        path="*"
        element={
          isLoggedIn() ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}
