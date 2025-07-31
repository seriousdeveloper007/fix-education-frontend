// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import LandingPage from './components/LandingPage';
// import PrivacyPolicy from './components/PrivacyPolicy';
// import CookiePolicy from './components/CookiePolicy';
// import TermsOfService from './components/TermsOfService';
// import GDPRCompliance from './components/GDPRCompliance';
// import Footer from './components/Footer';

// export default function App() {
//   return (
//     <BrowserRouter>

//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/privacy" element={<PrivacyPolicy />} />
//         <Route path="/cookies" element={<CookiePolicy />} />
//         <Route path="/terms" element={<TermsOfService />} />

//         <Route path="/gdpr" element={<GDPRCompliance />} />
//       </Routes>

//     </BrowserRouter>
     
//   );
// }

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';

import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import TermsOfService from './components/TermsOfService';
import GDPRCompliance from './components/GDPRCompliance';
import GoogleLogin from './components/GoogleLogin';
import Platform from './components/Platform';
import ErrorPage from './components/ErrorPage';

import {landingContent} from './components/landingContent'; 

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

function AppRoutes({ theme, toggleTheme }) {
  const isLoggedIn = () => Boolean(localStorage.getItem('token'));
  const { navigation } = landingContent;
  const location = useLocation();
  const isPlatform = location.pathname.startsWith('/platform');

  return (
    <>
      {!isPlatform && (
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          navigation={navigation}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn() ? (
              <Navigate to="/platform" replace />
            ) : (
              <LandingPage theme={theme} />
            )
          }
        />
        <Route
          path="login"
          element={
            isLoggedIn() ? <Navigate to="/platform" replace /> : <GoogleLogin />
          }
        />
        <Route
          path="platform/*"
          element={<Platform theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route path="error" element={<ErrorPage />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cookies" element={<CookiePolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="gdpr" element={<GDPRCompliance />} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </>
  );
}
