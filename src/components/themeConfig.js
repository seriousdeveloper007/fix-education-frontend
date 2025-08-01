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
    navbarBg: 'bg-[#ffe9cc] hover:bg-white transition-colors duration-300',
    headerBorder: 'border-slate-200/50',
    borderTop: 'border-t border-slate-200/50',
    TextHoverEffect: 'text-black px-3 py-2 rounded-lg transition hover:bg-gray-200',
  },

  app: {
   root: 'min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-300/30 font-fraunces',


    appHeader: 'bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-200/50',
    appNavLink: 'text-slate-700 hover:text-emerald-600 transition-colors duration-200',
    breadcrumb: 'text-sm text-slate-500 hover:text-slate-700',
    
    // Video Player Components
    videoContainer: 'w-full h-full bg-black rounded-lg shadow-xl overflow-hidden ring-1 ring-slate-200/50',
    videoPlayer: 'w-full h-full bg-black',
    videoControls: 'bg-black/80 backdrop-blur-sm',
    videoOverlay: 'bg-black/50 hover:bg-black/30 transition-all duration-300',
    videoProgress: 'bg-emerald-600 h-1 transition-all duration-100',
    videoTimestamp: 'text-white text-sm bg-black/70 px-2 py-1 rounded',
    
    // Note-Taking Interface
    notesContainer: 'bg-white/90 rounded-lg shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm',
    notesHeader: 'border-b border-slate-200/50 p-4 bg-white/95',
    notesEditor: 'min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 bg-white',
    noteCard: 'bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200/50',
    noteTimestamp: 'text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full',
    notesToolbar: 'flex items-center gap-2 p-2 border-b border-slate-200/50 bg-white/95',
    
    // Quiz Components
    quizContainer: 'bg-white/95 rounded-lg shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm',
    quizOverlay: 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center',
    quizCard: 'bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4',
    quizQuestion: 'text-lg font-medium text-slate-900 mb-4',
    quizOption: 'p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition-all duration-200',
    quizOptionSelected: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    quizOptionCorrect: 'border-green-500 bg-green-50 text-green-800',
    quizOptionIncorrect: 'border-red-500 bg-red-50 text-red-800',
    quizProgress: 'bg-slate-200 h-2 rounded-full overflow-hidden',
    quizProgressBar: 'bg-emerald-600 h-full transition-all duration-300',
    
    // AI Chat Interface
    aiChatContainer: 'bg-white/90 rounded-lg shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm',
    aiChatHeader: 'p-4 border-b border-slate-200/50 bg-white/95 rounded-t-lg',
    aiChatMessages: 'p-4 space-y-3 max-h-[400px] overflow-y-auto',
    aiMessageUser: 'bg-emerald-100 text-emerald-800 p-3 rounded-lg ml-8',
    aiMessageBot: 'bg-slate-100 text-slate-700 p-3 rounded-lg mr-8',
    aiChatInput: 'flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300/50 bg-white',
    aiChatButton: 'bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200',
    
    // Learning Progress & Status
    progressContainer: 'bg-white/90 rounded-lg p-4 shadow-md ring-1 ring-slate-200/50',
    progressBar: 'bg-slate-200 h-3 rounded-full overflow-hidden',
    progressFill: 'bg-emerald-600 h-full transition-all duration-500',
    progressText: 'text-sm text-slate-600 mt-2',
    completionBadge: 'bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium',
    
    // Learning Sidebar & Navigation
    learningSidebar: 'bg-white/70 backdrop-blur-sm border-r border-slate-200/50',
    sidebarSection: 'p-4 border-b border-slate-200/50',
    sidebarItem: 'p-2 rounded-lg hover:bg-white/80 cursor-pointer transition-colors duration-200',
    sidebarItemActive: 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600',
    sidebarIcon: 'text-slate-600 hover:text-emerald-600',
    
    // Study Materials & Resources
    materialCard: 'bg-white/90 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ring-1 ring-slate-200/50',
    materialIcon: 'text-slate-600 hover:text-emerald-600',
    resourceTag: 'bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs',
    
    // Interactive Learning Elements
    interactiveBtn: 'bg-white/90 border border-slate-300 text-slate-700 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 shadow-sm',
    learningCard: 'bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ring-1 ring-slate-200/50 backdrop-blur-sm',
    
    // Buttons (enhanced for better contrast)
    primaryBtn: 'bg-slate-900 text-white rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition duration-200 ease-in-out',
    secondaryBtn: 'bg-white border border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors duration-200',
    successBtn: 'bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-200',
    
    // Text Styles
    text: 'text-slate-600',
    heading: 'text-slate-900 font-medium',
    subtext: 'text-sm text-slate-500',
    linkText: 'text-emerald-600 hover:text-emerald-700 transition-colors duration-200',
    
    // Utility Classes
    cardBg: 'bg-white/90 ring-slate-200/50 backdrop-blur-sm',
    overlayBg: 'bg-slate-900/50 backdrop-blur-sm',
    borderLight: 'border-slate-200/50',
    hoverEffect: 'hover:bg-white/90 transition-colors duration-200',
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-emerald-300/50',
  }
  
    
};