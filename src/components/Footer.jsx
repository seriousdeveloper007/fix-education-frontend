// // 

// // Assuming this is in a React component file, e.g., Footer.jsx
// // You may need to install lucide-react for icons: npm install lucide-react
// import {
//   Twitter,
//   Linkedin,
//   Github,
//   MessageCircle,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// // Assuming themes are imported from a separate file, e.g., import themes from './themes';
// const themes = {
//   light: {
//     root: 'min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 text-slate-900 selection:bg-emerald-300/30',
//     headerBg: 'bg-white/70 ring-slate-200/50 text-slate-900',
//     navLink: 'text-slate-700 hover:text-emerald-600',
//     primaryBtn: 'bg-emerald-500 hover:bg-emerald-600 text-white',
//     secondaryBtn: 'border border-slate-300 hover:border-emerald-500 bg-white/30 text-slate-900',
//     cardBg: 'bg-white/70 ring-slate-200/50',
//     text: 'text-slate-600',
//     statText: 'text-sm text-slate-500',
//     icon: 'text-slate-700 hover:text-emerald-600',
    
//   },
//   dark: {
//     root: 'min-h-screen bg-gradient-to-br from-[#10141f] via-[#0c1424] to-[#05080f] text-white selection:bg-emerald-400/30',
//     headerBg: 'bg-white/5 ring-white/10 text-white',
//     navLink: 'text-white hover:text-emerald-400',
//     primaryBtn: 'bg-emerald-400 hover:bg-emerald-300 text-slate-900',
//     secondaryBtn: 'border border-white/20 hover:border-emerald-400 backdrop-blur-sm text-white',
//     cardBg: 'bg-white/10 ring-white/10',
//     text: 'text-slate-300',
//     statText: 'text-sm text-slate-300',
//     icon: 'text-white hover:text-emerald-400',

//   },
// };

// // Map icon names to Lucide components (adjust if using a different icon library)
// const iconMap = {
//   Twitter,
//   Linkedin,
//   Github,
//   MessageCircle,
// };

// const Footer = ({ footer, theme = 'light' }) => {
//   const classes = themes[theme];

//   return (
//     <footer
//       className={`px-6 py-12 ${classes.text} border-t ${theme === 'light' ? 'border-slate-200/50' : 'border-white/10'}`}
//     >
//       <div className="max-w-7xl mx-auto">
//         {/* Description */}
//         <p className={`mb-10 text-sm ${classes.text}`}>
//           {footer.description}
//         </p>

//         {/* Sections */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
//           {footer.sections.map((section) => (
//             <div key={section.title}>
             
//               <h3 className={`font-semibold mb-4` }>
//                 {section.title}
//               </h3>
//               <ul>
//                 {section.links.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       to={link.href}
//                       className={`${classes.navLink} block py-1 text-sm transition-colors`}
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Social Links */}
//         <div className="flex justify-center space-x-6 mb-10">
//           {footer.socialLinks.map((social) => {
//             const IconComponent = iconMap[social.icon];
//             return (
//               <a
//                 key={social.platform}
//                 href={social.href}
//                 className={`${classes.icon} transition-colors`}
//                 aria-label={social.platform}
//               >
//                 <IconComponent size={24} />
//               </a>
//             );
//           })}
//         </div>

//         {/* Copyright */}
//         <p className="text-center text-sm">
//           {footer.copyright}
//         </p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
// src/components/Footer.jsx

// src/components/Footer.jsx
import React from 'react';
import * as Icons from 'lucide-react';
import themeConfig from './themeConfig';

const Footer = ({ footer, theme = 'website' }) => {
  const cfg = themeConfig[theme];

  return (
    <footer
      className={`
        ${cfg.cardBg}
        backdrop-blur-lg
        ${cfg.text}
        px-6 py-12
        ${cfg.borderTop}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {footer.description && (
          <p className="mb-8 text-center text-sm">
            {footer.description}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footer.sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block mb-2 transition-colors hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-6">
          {footer.socialLinks.map((social) => {
            const Icon = Icons[social.icon];
            return (
              <a
                key={social.platform}
                href={social.href}
                aria-label={social.platform}
                className="transition-colors hover:text-emerald-400"
              >
                <Icon size={20} className={cfg.icon} />
              </a>
            );
          })}
        </div>

        <p className={`mt-8 text-center text-sm ${cfg.statText}`}>
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

