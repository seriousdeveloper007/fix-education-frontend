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

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';

import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import TermsOfService from './components/TermsOfService';
import GDPRCompliance from './components/GDPRCompliance';
import GoogleLogin from './components/GoogleLogin';
import Workspace from './components/Workspace';
import ErrorPage from './components/ErrorPage';

import {landingContent} from './components/landingContent'; 

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const isLoggedIn = () => Boolean(localStorage.getItem('token'));
  const { navigation } = landingContent;
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/platform');

  return (
    <>
      {!isWorkspace && <Navbar navigation={navigation} />}
      <Routes>
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
        <Route
          path="login"
          element={
            isLoggedIn() ? <Navigate to="/platform" replace /> : <GoogleLogin />
          }
        />
        <Route
          path="platform/*"
          element={<Workspace />}
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
