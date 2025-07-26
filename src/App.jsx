import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Careers from './components/Careers';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
