import Logo from '../assets/logo-without-bg.png';
import ExtensionIcon from '../assets/extension_icon.png';
import ExtensionPin from '../assets/extension-pin.png';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import analytics from '../../services/posthogService';
import LoginCard from '../LoginCard';  // contains ALL login logic



export default function GoogleLogin() {
  const [fromExtension, setFromExtension] = useState(false);
  const [fromRoadmap, setFromRoadmap] = useState(false); 

   /* detect URL parameters */
   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Existing extension detection
    if (params.get('from-extension') === 'true') {
      setFromExtension(true);
    }
    
    // NEW: Detect roadmap parameter
    if (params.get('from') === 'roadmap') {
      setFromRoadmap(true);
    }
    
    // Clean URL
    if (params.has('from-extension') || params.has('from')) {
      const url = new URL(window.location);
      url.searchParams.delete('from-extension');
      url.searchParams.delete('from');
      window.history.replaceState({}, '', url);
    }
  }, []);
  useEffect(() => analytics.loginPageLoaded(), []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4DEC2] font-fraunces">
      <Navbar showNav={false} showButtons={false} />
      {fromExtension && (
        <div className="fixed top-20 right-8 z-50 w-80 bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="ilon AI logo" className="mr-2 w-8 h-8 rounded" />
            <span className="text-xl font-semibold text-gray-900">ILON AI</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg font-bold text-gray-800 mb-2">Pin ILON AI to access later</h2>

          {/* Subtext */}
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-600 mb-4 text-center flex items-center">
              Click the
              <span className="inline-block mx-1">
                <img src={ExtensionIcon} alt="ILON AI logo" className="w-8 h-8 rounded" />
              </span>
              above to pin ILON AI.
            </p>
          </div>


          {/* Image demo section */}
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <img
              src={ExtensionPin}
              alt="Pin example"
              className="w-full"
            />
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setFromExtension(false)}
            className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg text-gray-700"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-grow flex items-start justify-center px-4 pt-16">
      <LoginCard 
          heading={fromRoadmap ? "Sign In to Secure Your Roadmap" : undefined}
        />
      </div>
    </div>
  );
}
