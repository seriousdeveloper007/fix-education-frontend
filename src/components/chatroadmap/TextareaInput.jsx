// TextAreaInput.jsx
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTypewriter } from '../../hooks/useTypewriter';

export default function TextAreaInput({ prompts = [] }) {
  const [value, setValue] = useState('');
  const hint = useTypewriter({ prompts });

  return (
    <div className="border rounded-xl flex items-start px-2 py-1 shadow-sm bg-white/70 backdrop-blur-md">
      <div className="relative flex-1">
        {/* Typewriter hint only when textarea is empty */}
        {value.length === 0 && (
          <div className="pointer-events-none absolute left-3 top-2.5 right-2 text-sm text-slate-400/90">
            {hint}
            <span className="inline-block w-2 animate-pulse">|</span>
          </div>
        )}

        <textarea
          rows={3}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full resize-none px-3 py-2 text-sm focus:outline-none focus:ring-0 border-none scrollbar-hide bg-transparent"
          style={{ maxHeight: '120px', minHeight: '40px', overflowY: 'auto' }}
        />
      </div>

      <div className="flex-col space-y-2">
        {/* Send button - now square */}
        <div className="flex justify-end">
        <button
          className="mt-2 h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] flex items-center justify-center 
                     bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] 
                     hover:from-[#0369a1] hover:to-[#06b6d4] text-white 
                     rounded-lg transition-all"
          title="Send"
        >
          <ArrowRight size={20} />
        </button>
        </div>

        {/* Restart button */}
        <button
          type="button"
          className="text-xs font-medium bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] 
                     bg-clip-text text-transparent hover:underline cursor-pointer"
        >
          + Start Again
        </button>
      </div>
    </div>
  );
}
