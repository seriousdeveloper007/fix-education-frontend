// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

//   const [isScrolled, setIsScrolled] = useState(false);
//   window.addEventListener('scroll', () => {
//     setIsScrolled(window.scrollY > 0);
//   });

//   return (
//     <nav className={`sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-md px-4 py-3 md:flex md:items-center md:justify-between transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
//       {/* Logo & App Name */}
//       <div className="flex items-center justify-between cursor-pointer" onClick={() => window.location.href = '/'}>
//         <div className="flex items-center space-x-2">
//           <div className="h-8 w-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
//           <h1 className="text-2xl font-semibold text- transition-colors duration-300">
//             EduNote
//           </h1>
//         </div>
//         {/* Hamburger menu for mobile */}
//         <div className="md:hidden">
//           <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
//             <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               {isOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Desktop Menu */}
//       <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-8`}>
//         <ul className="mt-4 md:mt-0 flex flex-col md:flex-row md:space-x-6">
//           {/* Products with dropdown */}
//           <li className="relative">
//             <button
//               onMouseEnter={() => setDropdownOpen(true)}
//               onMouseLeave={() => setDropdownOpen(false)}
//               className="flex items-center space-x-2 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white px-3 py-2 rounded transition duration-300"
//             >
//               <span>Products</span>
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dropdownOpen ? 'M19 9l-7 7-7-7' : 'M19 15l-7-7-7 7'} />
//               </svg>
//             </button>
//             {/* Products Dropdown menu */}
//             {dropdownOpen && (
//               <div
//                 className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-50"
//                 onMouseEnter={() => setDropdownOpen(true)}
//                 onMouseLeave={() => setDropdownOpen(false)}
//               >
//                 <Link
//                   to="/extension"
//                   className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white rounded-t-lg transition duration-200"
//                 >
//                   Google Chrome Extension
//                 </Link>
//               </div>
//             )}
//           </li>

//           {/* Pricing Page */}
//           <li>
//             <Link
//               to="/pricing"
//               className="block px-3 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white rounded transition duration-300"
//             >
//               Pricing
//             </Link>
//           </li>

//           {/* Resources with dropdown */}
//           <li className="relative">
//             <button
//               onMouseEnter={() => setResourcesDropdownOpen(true)}
//               onMouseLeave={() => setResourcesDropdownOpen(false)}
//               className="flex items-center space-x-2 text-gray-700 font-medium hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white px-3 py-2 rounded transition duration-300"
//             >
//               <span>Resources</span>
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={resourcesDropdownOpen ? 'M19 9l-7 7-7-7' : 'M19 15l-7-7-7 7'} />
//               </svg>
//             </button>
//             {/* Resources Dropdown menu */}
//             {resourcesDropdownOpen && (
//               <div
//                 className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-50"
//                 onMouseEnter={() => setResourcesDropdownOpen(true)}
//                 onMouseLeave={() => setResourcesDropdownOpen(false)}
//               >
//                 <Link
//                   to="/about"
//                   className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white rounded-t-lg transition duration-200"
//                 >
//                   About
//                 </Link>
//                 <Link
//                   to="/careers"
//                   className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition duration-200"
//                 >
//                   Careers
//                 </Link>
//                 <Link
//                   to="/blog"
//                   className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white rounded-b-lg transition duration-200"
//                 >
//                   Blog
//                 </Link>
//               </div>
//             )}
//           </li>
//         </ul>

//         {/* Login / Signup Button */}
//         <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
//           <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full mt-2 md:mt-0 transition duration-300 transform hover:scale-105 shadow-lg">
//             Sign Up / Login 
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-md
        px-4 py-3 md:flex md:items-center md:justify-between
        transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => (window.location.href = '/')}
      >
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          <h1 className="text-2xl font-semibold transition-colors duration-300">
            EduNote
          </h1>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-8`}>
        <ul className="mt-4 md:mt-0 flex flex-col md:flex-row md:space-x-6">
          {/* Products */}
          <li className="relative">
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              className="flex items-center space-x-2 text-gray-700 font-medium
                hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
                px-3 py-2 rounded transition duration-300"
            >
              <span>Products</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    dropdownOpen
                      ? 'M19 9l-7 7-7-7'
                      : 'M19 15l-7-7-7 7'
                  }
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-50"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  to="/extension"
                  className="block px-4 py-2 text-gray-700
                    hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
                    rounded-t-lg"
                >
                  Google Chrome Extension
                </Link>
              </div>
            )}
          </li>

          {/* Pricing */}
          <li>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-gray-700
                hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
                rounded transition duration-300"
            >
              Pricing
            </Link>
          </li>

          {/* Resources */}
          <li className="relative">
            <button
              onMouseEnter={() => setResourcesDropdownOpen(true)}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
              className="flex items-center space-x-2 text-gray-700 font-medium
                hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
                px-3 py-2 rounded transition duration-300"
            >
              <span>Resources</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    resourcesDropdownOpen
                      ? 'M19 9l-7 7-7-7'
                      : 'M19 15l-7-7-7 7'
                  }
                />
              </svg>
            </button>
            {resourcesDropdownOpen && (
              <div
                className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-48 z-50"
                onMouseEnter={() => setResourcesDropdownOpen(true)}
                onMouseLeave={() => setResourcesDropdownOpen(false)}
              >
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-700
                    hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
                    rounded-t-lg"
                >
                  About
                </Link>
                <Link
                  to="/careers"
                  className="block px-4 py-2 text-gray-700
                    hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white"
                >
                  Careers
                </Link>
                <Link
                  to="/blog"
                  className="block px-4 py-2 text-gray-700
                    hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white
                    rounded-b-lg"
                >
                  Blog
                </Link>
              </div>
            )}
          </li>
        </ul>

        {/* Google Login */}
        <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
          <GoogleLogin />
        </div>
      </div>
    </nav>
  );
}
