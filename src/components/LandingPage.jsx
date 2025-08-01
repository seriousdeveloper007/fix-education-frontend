// export default LandingPage;
import React from 'react';
import { Download } from 'lucide-react';
import themeConfig from './themeConfig';
import { landingContent  } from './landingContent';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';


const CTAButtons = ({ center = false, showDownload = true }) => {
  const cfg = themeConfig.website;
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col sm:flex-row items-start ${
        center ? 'justify-center items-center' : ''
      } gap-3 sm:gap-4 mt-6`}
    >
      <button
        onClick={() => navigate('/login')}
        className={`${cfg.primaryBtn} transition font-medium px-4 py-3 sm:py-3.5 text-sm sm:text-base`}
      >
        Start learning for Free
      </button>

      {showDownload && (
        <button
          className={`hidden sm:inline-flex items-center gap-2 ${cfg.secondaryBtn} px-5 py-3 sm:py-3.5 font-medium transition`}
        >
          <Download size={16} />
          Chrome Extension
        </button>
      )}
    </div>
  );
};


const LandingPage = () => {
  const { useCases, faqs } = landingContent;


  return (
    <div className="bg-white min-h-screen font-fraunces">
      <Navbar />
      <div
        id="hero"
        className="bg-[#ffe9cc] shadow-md px-4 sm:px-6 md:px-[100px] pt-20 pb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-snug">
          Stop passively watching,{' '}
          <br className="hidden sm:block" />
          Start interactive learning on YouTube.
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-2xl">
          Ask doubts while watching, answer ilon AI questions in every 5–10 mins, and auto-organize your notes.
        </p>
        <CTAButtons />
        <div id="how-to-use" className="mt-10 border-2 border-dashed border-gray-400 rounded-xl bg-white flex items-center justify-center text-gray-600 text-base sm:text-lg 
          h-[300px] sm:h-[400px] md:h-[500px]">
          How to use — there will be a video here in future
        </div>
      </div>
      <div
        id="usecase"
        className="px-4 sm:px-6 md:px-[100px] py-16 bg-white"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-snug text-center mb-12">
          Why use ilon ai?
        </h2>
        <div className="flex flex-col gap-16">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12 mt-16"
              >
                {/* Left: Icon + Text Section */}
                <div className="flex-1 flex items-start gap-4">
                  {/* Icon */}
                  <div className="mt-1">
                    <div className="p-2 rounded-lg bg-[#ffe9cc] inline-flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#f2542d]" />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="text-left max-w-[600px]">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-700">
                      {useCase.description}
                    </p>
                  </div>
                </div>

                {/* Right: Image Section */}
                <div className="w-full md:w-auto md:flex-shrink-0 md:self-start md:ml-auto">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full max-w-md rounded-xl md:w-[400px] md:max-w-none md:rounded-xl"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        id="pricing"
        className="px-4 sm:px-6 md:px-[100px] py-16 bg-[#d6f3fc]"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-snug text-center mb-6">
          Pricing
        </h2>
        <p className="text-center mx-auto text-lg sm:text-xl md:text-2xl text-black">
          ilon ai is completely free to use — no subscriptions, no hidden fees.
        </p>
        <CTAButtons center />

      </div>
      <div
      id="faqs"
      className="px-4 sm:px-6 md:px-[100px] py-16 bg-white"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-snug text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          >
            <details className="group">
              <summary className="cursor-pointer px-6 py-4 font-semibold text-slate-900 bg-[#f9fafb] hover:bg-[#f3f4f6] transition">
                {faq.question}
              </summary>
              <div className="px-6 py-4 text-slate-700 text-base sm:text-lg bg-white border-t border-slate-200">
                {faq.answer}
              </div>
            </details>
          </div>
        ))}
      </div>
      <CTAButtons center />
    </div>
    <Footer />
    </div>
  );
};

export default LandingPage;


