import React from 'react';
import { motion } from 'framer-motion';
import { landingContent } from './landingContent';

import Footer from './Footer';
import themeConfig from './themeConfig';
import { PlayCircle, Layers3, MonitorPlay, Share2, MoveUpRight } from 'lucide-react';

// Frosted-glass card
const FrostCard = ({ children, className = '' }) => (
  <div className={`relative rounded-3xl shadow-lg backdrop-blur-xl backdrop-saturate-150 transition ${themeConfig.website.cardBg} ${className}`}> {children} </div>
);

const LandingPage = () => {
  const cfg = themeConfig.website;
  const { hero, howItWorks, pricing, footer } = landingContent;

  return (
    <div className={cfg.root}>

      {/* HERO */}
      <section className="relative pt-28 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute -left-56 -top-40 w-[40rem] h-[40rem] bg-emerald-300/20 blur-[120px] rounded-full" />
        <div className="absolute right-0 top-1/3 w-[28rem] h-[28rem] bg-indigo-300/20 blur-[100px] rounded-full" />

        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mx-auto max-w-5xl text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
          {hero.headline}
        </motion.h1>
        <p className={`mt-6 mx-auto max-w-xl text-lg ${cfg.text}`}>{hero.subheadline}</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className={`px-8 py-4 rounded-lg font-semibold shadow-xl transition ${cfg.primaryBtn}`}>{hero.primaryCTA}</button>
          <button className={`flex gap-2 items-center px-8 py-4 rounded-lg transition ${cfg.secondaryBtn}`}>
            <PlayCircle size={20} className="text-emerald-600" /> {hero.secondaryCTA}
          </button>
        </div>
        {hero.statsText && <p className={`mt-4 ${cfg.statText}`}>{hero.statsText}</p>}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-24">
        <h2 className="text-center text-4xl font-bold mb-4">{howItWorks.title}</h2>
        <p className={`text-center mb-12 text-lg ${cfg.text}`}>{howItWorks.subtitle}</p>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {howItWorks.steps.map(({ step, title, description }, i) => {
            const Icon = [Layers3, MonitorPlay, Share2][i] || Layers3;
            return (
              <FrostCard key={step} className="p-8">
                <div className="flex items-baseline gap-2 text-sm font-semibold mb-2"><span className={cfg.primaryBtn.split(' ')[0]}>{step}</span></div>
                <Icon size={32} className="mb-6" />
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className={cfg.text}>{description}</p>
              </FrostCard>
            );
          })}
        </div>
      </section>

      {/* SPLIT DEMO */}
      <section className="relative backdrop-blur-md py-24 bg-white/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 items-center">
          <motion.div whileHover={{ scale: 1.03 }} className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/10"><video autoPlay muted loop playsInline src="https://cdn.edunote.ai/demo-trim.mp4" className="w-full h-full object-cover" /></motion.div>
          <div><h2 className="text-3xl font-bold mb-6">See your notes evolve in real time.</h2><ul className="space-y-4"><li className="flex gap-3 items-start"><Layers3 className="mt-1" /> AI detects headings & converts lists automatically.</li><li className="flex gap-3 items-start"><MonitorPlay className="mt-1" /> Timestamp links let you jump back to exact moments.</li><li className="flex gap-3 items-start"><Share2 className="mt-1" /> Export to Notion, Obsidian or markdown in one click.</li></ul></div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-28"><h2 className="text-center text-4xl font-bold mb-4">{pricing.title}</h2><p className={`text-center mb-12 text-lg ${cfg.text}`}>{pricing.subtitle}</p><div className="grid max-w-4xl mx-auto md:grid-cols-3 gap-10">{pricing.plans.map(plan => (<FrostCard key={plan.name} className="p-10"><h3 className="text-2xl font-semibold mb-2">{plan.name}</h3><p className="text-4xl font-bold mb-6">{plan.price} <span className="text-lg font-normal">/{plan.period}</span></p><ul className="space-y-3 mb-8">{plan.features.map(f => (<li key={f} className="flex gap-2 items-start"><MoveUpRight size={18} className="mt-1" />{f}</li>))}</ul><button className={`w-full rounded-full py-3 font-semibold transition ${plan.popular ? cfg.primaryBtn : cfg.secondaryBtn}`}>{plan.cta}</button></FrostCard>))}</div></section>

      {/* <Footer footer={footer} /> */}
      <Footer footer={footer} />
    </div>
  );
};

export default LandingPage;
