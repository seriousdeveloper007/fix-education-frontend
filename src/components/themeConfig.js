export default {
  light: {
    root: 'min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 text-slate-900 selection:bg-emerald-300/30',
    // headerBg: 'bg-white/70 ring-slate-200/50 text-slate-900',
    navLink: 'text-slate-700 hover:text-emerald-600',
    primaryBtn: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    secondaryBtn: 'border border-slate-300 hover:border-emerald-500 bg-white/30 text-slate-900',
    cardBg: 'bg-white/70 ring-slate-200/50',
    text: 'text-slate-600',
    statText: 'text-sm text-slate-500',
    icon: 'text-slate-700 hover:text-emerald-600',
    headerBg: 'bg-white/70 backdrop-blur-lg shadow-md',
    headerBorder: 'border-slate-200/50',
    borderTop: 'border-t border-slate-200/50',
  },
  dark: {
    root: 'min-h-screen bg-gradient-to-br from-[#10141f] via-[#0c1424] to-[#05080f] text-white selection:bg-emerald-400/30',
    //headerBg: 'bg-white/5 ring-white/10 text-white',
    navLink: 'text-white hover:text-emerald-400',
    primaryBtn: 'bg-emerald-400 hover:bg-emerald-300 text-slate-900',
    secondaryBtn: 'border border-white/20 hover:border-emerald-400 backdrop-blur-sm text-white',
    cardBg: 'bg-white/10 ring-white/10',
    text: 'text-slate-300',
    statText: 'text-sm text-slate-300',
    icon: 'text-white hover:text-emerald-400',
    headerBg: 'bg-[#0c1424]/70 backdrop-blur-lg shadow-md',
    headerBorder: 'border-white/10',
    borderTop: 'border-t border-white/10',
  },

  website: {
    root: 'min-h-screen bg-[#ffe9cc] text-slate-900 selection:bg-emerald-300/30 font-fraunces',
    navLink: 'text-slate-700 hover:text-emerald-600',
    primaryBtn: 'bg-black text-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition duration-200 ease-in-out',
    secondaryBtn: 'bg-white border border-gray-300 text-black rounded-lg hover:border-black  ',
    cardBg: 'bg-white/70 ring-slate-200/50',
    text: 'text-slate-600',
    statText: 'text-sm text-slate-500',
    icon: 'text-slate-700 hover:text-emerald-600',
    headerBg: 'bg-white/70 backdrop-blur-lg shadow-md',
    navbarBg: 'bg-[#ffe9cc]',
    headerBorder: 'border-slate-200/50',
    borderTop: 'border-t border-slate-200/50',
    TextHoverEffect: 'text-black px-3 py-2 rounded-lg transition hover:bg-gray-200',
    authHeading: 'text-3xl sm:text-4xl font-extrabold text-center text-gray-900',
    authSubheading: 'text-base sm:text-lg font-normal text-center text-gray-600 mt-2',
    authMuted: 'text-xs text-gray-500 text-center',
  },

  app: {
   root: 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900 selection:bg-emerald-300/30 font-fraunces',


    appHeader: 'bg-slate-50',
    appNavLink: 'text-slate-700 hover:text-emerald-600 transition-colors duration-200',
    
    // Video Player Components
    videoContainer: 'w-full h-full bg-black rounded-lg shadow-xl overflow-hidden ring-1 ring-slate-200/50',
    videoPlayer: 'w-full h-full bg-black',
    // Previously defined video classes removed as they were unused
    
    // Note-Taking Interface
    notesContainer: 'bg-white/90 rounded-lg shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm',
    notesHeader: 'border-b border-slate-200/50 p-4 bg-white/95',
    notesEditor: 'min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 bg-white',
    // Removed unused note card helpers
    
    // Quiz Components
    quizContainer: 'bg-white/95 rounded-lg shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm',
    // Removed unused quiz styling helpers
    
    // AI Chat Interface
    aiChatContainer: 'bg-white/90 rounded-lg shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm',
    aiChatHeader: 'p-4 border-b border-slate-200/50 bg-white/95 rounded-t-lg',
    aiChatMessages: 'p-4 space-y-3 max-h-[400px] overflow-y-auto',
    aiMessageBot: 'bg-slate-100 text-slate-700 p-3 rounded-lg mr-8',
    aiChatInput: 'flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300/50 bg-white',
    aiChatButton: 'bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200',
    
    // Learning Progress & Status
    // Removed learning progress helpers
    
    // Learning Sidebar & Navigation
    sidebarIcon: 'text-slate-600 hover:text-emerald-600',
    
    // Study Materials & Resources
    materialCard: 'bg-white/90 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ring-1 ring-slate-200/50',
    // Interactive Learning Elements
    learningCard: 'bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ring-1 ring-slate-200/50 backdrop-blur-sm',
    
    // Buttons (enhanced for better contrast)
    primaryBtn: 'bg-slate-900 text-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition duration-200 ease-in-out',
    secondaryBtn: 'bg-white border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors duration-200',
    successBtn: 'bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-200',
    
    // Text Styles
    text: 'text-slate-600',
    heading: 'text-slate-900 font-medium',
    subtext: 'text-sm text-slate-500',
    // Utility Classes
    cardBg: 'bg-white/90 ring-slate-200/50 backdrop-blur-sm',
    hoverEffect: 'hover:bg-white/90 transition-colors duration-200',
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-emerald-300/50',
  }
  
    
};