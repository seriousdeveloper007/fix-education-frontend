import themeConfig from './themeConfig';

export default function LectureSidePanel({ activePanel, closePanel }) {
  const cfg = themeConfig.app;

  const panelContent = {
    doubt: 'Welcome! This is the AI Doubt Resolution section. Ask me anything about the lecture.',
    notes: 'This is where your Learning Notes appear. You can enhance them as needed.',
    test: 'This section will contain questions to test your understanding.',
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-[30rem] max-w-full h-full shadow-xl transition-transform transform ${
        activePanel ? 'translate-x-0' : 'translate-x-full'
      } ${
        activePanel === 'doubt' ? cfg.aiChatContainer :
        activePanel === 'notes' ? cfg.notesContainer :
        activePanel === 'test' ? cfg.quizContainer :
        cfg.cardBg
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 ${
        activePanel === 'doubt' ? cfg.aiChatHeader :
        activePanel === 'notes' ? cfg.notesHeader :
        'border-b border-slate-200/50 bg-white/80'
      }`}>
        <h2 className={`font-semibold capitalize ${cfg.heading}`}>
          {activePanel === 'doubt' ? 'AI Doubt Resolution' :
           activePanel === 'notes' ? 'Learning Notes' :
           activePanel === 'test' ? 'Knowledge Test' :
           activePanel || ''}
        </h2>
        <button
          onClick={closePanel}
          aria-label="Close"
          className={`text-xl hover:bg-slate-100 p-1 rounded ${cfg.hoverEffect}`}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto h-full pb-16">
        <p className={`${cfg.subtext} whitespace-pre-line`}>
          {panelContent[activePanel] || ''}
        </p>
      </div>
    </aside>
  );
}
