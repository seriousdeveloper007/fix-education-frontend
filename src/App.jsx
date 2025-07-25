import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Careers from './components/Careers';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';


export default function App() {
  return (
    <>
     <BrowserRouter>
       <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} /> 
      

      </Routes>
      <Footer/>  

      </BrowserRouter> */
    

     
    </>
  );
}
