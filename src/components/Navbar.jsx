
// import { useState } from 'react';
// import {
//   Sparkles,
//   Sun,
//   Moon,
//   ChevronDown,
//   Menu,
// } from 'lucide-react';

// import themeConfig from './themeConfig';


// const Navbar = ({ theme, toggleTheme, navigation }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const cfg = themeConfig[theme];
//   console.log(theme)
//   console.log(cfg)

//   return (
//     <header
//       className={`sticky top-0 z-50  ${cfg.headerBg} border-b ${cfg.headerBorder}
//         }`}
//     >
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//         <span className="font-bold text-xl flex items-center gap-2">
//           <Sparkles
//             size={22}
//             className={cfg.icon}
//           />
//           {navigation.logo}
//         </span>

//         <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
//           {navigation.menuItems.map((item) => {
//             const hasChildren = item.children && item.children.length > 0;
//             const defaultHref = `/#${item.label.toLowerCase().replace(/\s+/g, '-')}`;

//             return hasChildren ? (
//               <div key={item.label} className="relative group">
//                 <span
//                   className={`${cfg.navLink} cursor-pointer flex items-center gap-1 transition-colors`}
//                 >
//                   {item.label}
//                   <ChevronDown size={16} />
//                 </span>
//                 <ul
//                   className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${cfg.cardBg} hidden group-hover:block`}
//                 >
//                   {item.children.map((child) => (
//                     <li key={child.label}>
//                       <a
//                         href={child.href}
//                         className={`${cfg.navLink} block px-4 py-2 text-sm transition-colors`}
//                       >
//                         {child.label}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <a
//                 key={item.label}
//                 href={defaultHref}
//                 className={`${cfg.navLink} transition-colors`}
//               >
//                 {item.label}
//               </a>
//             );
//           })}
//         </nav>

//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className={`md:hidden p-1 rounded transition ${cfg.icon}`}
//             aria-label="Toggle menu"
//           >
//             <Menu size={24} />
//           </button>
//           <button
//             onClick={toggleTheme}
//             className={`p-2 rounded-full transition ${cfg.icon}`}
//             aria-label="Toggle theme"
//           >
//             {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
//           </button>
//           <button
//             className={`rounded-full px-5 py-2 text-sm font-semibold shadow-md transition ${cfg.primaryBtn}`}
//           >
//             {navigation.ctaButton}
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <div
//           className={`md:hidden border-t ${theme === 'light' ? 'border-slate-200/50' : 'border-white/10'} ${cfg.cardBg}`}
//         >
//           {navigation.menuItems.map((item) => {
//             const hasChildren = item.children && item.children.length > 0;
//             const defaultHref = `/#${item.label.toLowerCase().replace(/\s+/g, '-')}`;

//             return (
//               <div key={item.label}>
//                 {hasChildren ? (
//                   <>
//                     <div className={`px-6 py-3 font-medium ${cfg.text}`}>
//                       {item.label}
//                     </div>
//                     {item.children.map((child) => (
//                       <a
//                         key={child.label}
//                         href={child.href}
//                         className={`${cfg.navLink} block px-10 py-2 text-sm transition-colors`}
//                       >
//                         {child.label}
//                       </a>
//                     ))}
//                   </>
//                 ) : (
//                   <a
//                     href={defaultHref}
//                     className={`${cfg.navLink} block px-6 py-3 font-medium transition-colors`}
//                   >
//                     {item.label}
//                   </a>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;
// Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronDown,
  Menu,
} from 'lucide-react';

import themeConfig from './themeConfig';

const Navbar = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cfg = themeConfig.website;

  return (
    <header
      className={`
        sticky top-0 z-50
        ${cfg.headerBg}
        border-b ${cfg.headerBorder}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <span className="font-bold text-xl flex items-center gap-2">
          <Sparkles size={22} className={cfg.icon} />
          {navigation.logo}
        </span>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navigation.menuItems.map((item) => {
            const hasChildren = item.children?.length > 0;
            const defaultHref = `/#${item.label.toLowerCase().replace(/\s+/g, '-')}`;

            return hasChildren ? (
              <div key={item.label} className="relative group">
                <span className={`${cfg.navLink} cursor-pointer flex items-center gap-1 transition-colors`}>
                  {item.label}
                  <ChevronDown size={16} />
                </span>
                <ul className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${cfg.cardBg} hidden group-hover:block`}>
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a href={child.href} className={`${cfg.navLink} block px-4 py-2 text-sm transition-colors`}>
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a key={item.label} href={defaultHref} className={`${cfg.navLink} transition-colors`}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-1 rounded transition ${cfg.icon}`}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link
            to="/login"
            className={`rounded-full px-5 py-2 text-sm font-semibold shadow-md transition ${cfg.primaryBtn}`}
          >
            {navigation.ctaButton}
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden ${cfg.borderTop} ${cfg.cardBg}`}>
          {navigation.menuItems.map((item) => {
            const hasChildren = item.children?.length > 0;
            const defaultHref = `/#${item.label.toLowerCase().replace(/\s+/g, '-')}`;

            return (
              <div key={item.label}>
                {hasChildren ? (
                  <>
                    <div className={`px-6 py-3 font-medium ${cfg.text}`}>{item.label}</div>
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className={`${cfg.navLink} block px-10 py-2 text-sm transition-colors`}
                      >
                        {child.label}
                      </a>
                    ))}
                  </>
                ) : (
                  <a
                    href={defaultHref}
                    className={`${cfg.navLink} block px-6 py-3 font-medium transition-colors`}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
