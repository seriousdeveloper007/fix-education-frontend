import React from 'react';

export default function CreateNewButton({ 
  onClick, 
  text = "Create New Roadmap",
  className = "" 
}) {
  const baseClasses = "px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white rounded-lg transition-all text-sm";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {text}
    </button>
  );
}