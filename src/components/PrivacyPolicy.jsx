import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Settings, Share, Globe, Clock, Key, Trash2, Mail } from 'lucide-react';
import themeConfig from './themeConfig';
import Navbar from './Navbar';

const Section = ({ icon: Icon, title, children }) => (
  <div className="mt-12">
    <h4 className="text-xl font-semibold flex items-center text-orange-600">
      <Icon className="mr-2" size={22} />
      {title}
    </h4>
    <div className="mt-4 space-y-4 text-gray-700">{children}</div>
  </div>
);

const PrivacyPolicy = ({ theme = 'light' }) => {
  const cfg = themeConfig[theme];

  return (
    <>
      <Navbar showNav={false} showButtons={true} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-4xl mx-auto py-12 px-[50px] sm:px-[100px] ${cfg.cardBg} rounded-lg font-geist`}
      >
        {/* Heading */}
        <motion.h1
          className="text-3xl font-bold mb-8 flex items-center text-orange-700"
          whileHover={{ scale: 1.02 }}
        >
          <Shield className={`${cfg.icon} mr-2`} size={28} />
          Privacy Policy
        </motion.h1>

        {/* Agreement */}
        <Section icon={Shield} title="AGREEMENT TO OUR LEGAL TERMS">
          <p>
            This privacy notice for ilon ai ("we," "us," or "our") describes how and why we might collect,
            store, use, and/or share ("process") your information when you use our services ("Services").
          </p>
          <p>
            Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree
            with our policies and practices, please do not use our Services. Contact us at <a className="underline text-orange-700" href="mailto:support@ilon.ai.digital">support@ilon.ai.digital</a> with any questions.
          </p>
        </Section>

        {/* Summary */}
        <Section icon={User} title="SUMMARY OF KEY POINTS">
          <p><strong>What personal information do we process?</strong> ...</p>
          <p><strong>Do we process any sensitive personal information?</strong> ...</p>
          <p><strong>Do we receive any information from third parties?</strong> ...</p>
          <p><strong>How do we process your information?</strong> ...</p>
          <p><strong>With whom do we share personal information?</strong> ...</p>
          <p><strong>What are your rights?</strong> ...</p>
          <p><strong>How do you exercise your rights?</strong> ...</p>
        </Section>

        <Section icon={User} title="1. WHAT INFORMATION DO WE COLLECT?">
          <p><strong>Personal information you disclose to us:</strong> We collect personal information that you voluntarily provide to us.</p>
          <p><strong>Sensitive Information:</strong> We do not process sensitive personal information.</p>
        </Section>

        <Section icon={Settings} title="2. HOW DO WE PROCESS YOUR INFORMATION?">
          <p><strong>In Short:</strong> We process your personal information for various business purposes depending on how you interact with our Services.</p>
        </Section>

        <Section icon={Share} title="3. WHEN AND WITH WHOM DO WE SHARE YOUR INFORMATION?">
          <p><strong>In Short:</strong> We may share your data with:</p>
          <p><strong>Business Transfers:</strong> ...</p>
          <p><strong>Affiliates:</strong> ...</p>
          <p><strong>Business Partners:</strong> ...</p>
        </Section>

        <Section icon={Settings} title="4. DO WE USE COOKIES OR TRACKING TECHNOLOGIES?">
          <p><strong>In Short:</strong> Yes, we may use cookies and other tracking technologies to collect and store your information.</p>
        </Section>

        <Section icon={Globe} title="5. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?">
          <p><strong>In Short:</strong> We may transfer, store, and process your information in countries other than your own.</p>
        </Section>

        <Section icon={Clock} title="6. HOW LONG DO WE KEEP YOUR INFORMATION?">
          <p><strong>In Short:</strong> We keep your information as long as necessary for the purposes outlined in this policy.</p>
        </Section>

        <Section icon={Key} title="7. WHAT ARE YOUR PRIVACY RIGHTS?">
          <p><strong>In Short:</strong> You may review, change, or terminate your account at any time.</p>
          <p><strong>Withdrawing Consent:</strong> You can withdraw your consent to data processing at any time.</p>
        </Section>

        <Section icon={Trash2} title="8. HOW CAN YOU REVIEW, UPDATE OR DELETE YOUR DATA?">
          <p>You can request access to, update, or delete your personal information by contacting us at <a className="underline text-orange-700" href="mailto:support@ilon.ai.digital">support@ilon.ai.digital</a>.</p>
        </Section>

        <Section icon={Mail} title="9. HOW CAN YOU CONTACT US?">
          <p>If you have questions, email us at <a className="underline text-orange-700" href="mailto:support@ilon.ai.digital">support@ilon.ai.digital</a> or write to:</p>
          <p>
            ilon ai<br />
            Y7 001 GreenWood<br />
            Sarjapur , Bangalore 560035
          </p>
        </Section>
      </motion.div>
    </>
  );
};

export default PrivacyPolicy;
