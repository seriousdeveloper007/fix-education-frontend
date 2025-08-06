export default {
  website: {
    root: 'min-h-screen bg-[#F4DEC2] text-slate-900 selection:bg-emerald-300/30 font-fraunces',
    navLink: 'text-slate-700 hover:text-emerald-600',
    primaryBtn: 'bg-black text-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition duration-200 ease-in-out',
    secondaryBtn: 'bg-white border border-gray-300 text-black rounded-lg hover:border-black  ',
    cardBg: 'bg-white/70 ring-slate-200/50',
    text: 'text-slate-600',
    statText: 'text-sm text-slate-500',
    icon: 'text-slate-700 hover:text-emerald-600',
    headerBg: 'bg-white/70 backdrop-blur-lg shadow-md',
    navbarBg: 'bg-[#F4DEC2] hover:bg-white',
    headerBorder: 'border-slate-200/50',
    borderTop: 'border-t border-slate-200/50',
    TextHoverEffect: 'text-black px-3 py-2 rounded-lg transition hover:bg-gray-200',
    authHeading: 'text-xl sm:text-3xl font-bold text-center text-gray-900',
    authSubheading: 'text-base sm:text-lg font-normal text-center text-gray-600 mt-2',
    authMuted: 'text-xs text-gray-500 text-center',
  },

  app: {
    root: 'min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-white text-slate-900 selection:bg-emerald-300/30 font-fraunces',

    // header now has a subtle glass effect
    appHeader: 'bg-white/50 backdrop-blur-md shadow-md font-semibold text-lg h-20 flex items-center',
    
    // navigation
    tabActive: 'font-semibold text-black',
    tabInactive: 'text-gray-600 hover:text-black transition-colors duration-200',

    // user‑area
    dropdownIcon: 'w-5 h-5 cursor-pointer text-gray-700 hover:text-black transition-colors duration-200',
    dropdownMenu: 'absolute right-0 mt-2 w-36 bg-white/70 backdrop-blur-md border border-white/30 rounded-xl shadow-lg z-50 overflow-hidden',
    dropdownButton: 'w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/20 transition-colors duration-150',
    dropdownIconButton: 'w-4 h-4 mr-2',
    avatarImage: 'w-8 h-8 rounded-full object-cover ring-2 ring-white',
    avatarFallback: 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold',
    submitButton: 'absolute bottom-4 right-4 px-3 py-1 text-xs bg-gradient-to-r \
    from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] \
    hover:to-[#06b6d4] text-white font-medium shadow-lg \
    rounded-md transition-transform hover:-translate-y-0.5 disabled:opacity-50',

    // cards + misc
    card: 'bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg px-6 py-4 transition-transform hover:-translate-y-1 hover:shadow-xl',
    cardHeadinglarge: 'text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight',
    cardHeadingSecondary: 'text-base sm:text-lg font-medium text-slate-800',
    cardSubheading: 'mt-2 text-sm text-gray-600',
    primarytext: 'text-sm text-slate-700',

    // actions / inputs
    primaryButton: 'w-full max-w-[250px] px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white font-medium rounded-xl disabled:opacity-50 mt-5 transition-transform hover:-translate-y-0.5 shadow-lg',
    inputfield: 'w-full bg-white/60 backdrop-blur-sm border border-gray-300 rounded px-3 py-2 mt-5 placeholder-gray-500 focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600',

    questionText: 'mt-2 text-sm text-gray-700 mb-1',

  }
};