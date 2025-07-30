import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import themeConfig from './themeConfig'; 
import Navbar from './Navbar';

const PrivacyPolicy = ({ theme = 'light' }) => {
  const cfg = themeConfig[theme];

  return (
    <>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`prose max-w-3xl mx-auto py-12 ${cfg.cardBg} rounded-lg p-6 font-geist`}
    >
      <motion.h1 className={cfg.heading} whileHover={{ scale: 1.02 }}>
        <Shield className={`${cfg.icon} inline-block mr-2`} size={24} />
        Privacy Policy
      </motion.h1>
      <p className={cfg.text}>Last updated: July 29, 2025</p>

      <h2 className={cfg.accent}>1. Introduction</h2>
      <p className={cfg.text}>[Your Company] (“we”, “us”, “our”) operates the Chrome extension “Ilon X” (the “Extension”). This Privacy Policy explains how we collect, use, and share personal data when you install or use the Extension.</p>

      <h2 className={cfg.accent}>2. Data Collection</h2>
      <ul className={cfg.text}>
        <li><strong>Usage Data:</strong> URLs visited, timestamps, and user interactions to power AI-driven learning features.</li>
        <li><strong>Metadata:</strong> Browser version, OS, and language (for analytics and support).</li>
      </ul>

      <h2 className={cfg.accent}>3. Data Use</h2>
      <p className={cfg.text}>We use data solely to:</p>
      <ul className={cfg.text}>
        <li>Provide and improve interactive AI learning features.</li>
        <li>Diagnose technical issues and enhance stability.</li>
      </ul>

      <h2 className={cfg.accent}>4. Data Disclosure</h2>
      <p className={cfg.text}>We do not sell or rent personal data. We disclose data only to:</p>
      <ul className={cfg.text}>
        <li>Comply with legal obligations.</li>
        <li>Protect against fraud or abuse.</li>
      </ul>

      <h2 className={cfg.accent}>5. Data Retention</h2>
      <p className={cfg.text}>We retain data only as long as needed to fulfill extension functionality or as required by law.</p>

      <h2 className={cfg.accent}>6. Your Rights</h2>
      <p className={cfg.text}>You may request access, correction, or deletion of your data by contacting us at <a href="mailto:privacy@ilonx.com" className={cfg.navLink}>privacy@ilonx.com</a>.</p>

      <h2 className={cfg.accent}>7. Contact</h2>
      <p className={cfg.text}>For privacy inquiries: <a href="mailto:privacy@ilonx.com" className={cfg.navLink}>privacy@ilonx.com</a></p>
    </motion.div>
    </>
  );
};

export default PrivacyPolicy;
