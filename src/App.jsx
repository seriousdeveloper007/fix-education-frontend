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
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme( prev => ( prev  === 'light' ? 'dark' : 'light'));

  const { navigation, footer } = landingContent;

  return (
    <BrowserRouter>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        navigation={navigation}
      />

      <Routes>
        <Route path="/" element={<LandingPage theme={theme} />} />
        <Route path="login" element={<GoogleLogin />} />
        <Route path="workspace" element={<Workspace />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cookies" element={<CookiePolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="gdpr" element={<GDPRCompliance />} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>

    
    </BrowserRouter>
  );
}
