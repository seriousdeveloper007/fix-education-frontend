import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';

function ToggleButton({ active, onClick, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 rounded font-semibold text-base
        transition-all duration-200 min-w-[40px]
        ${active 
          ? 'bg-emerald-500 text-white shadow-sm' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      aria-pressed={active}
      title={label}
    >
      {icon || label}
    </button>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setFormats({
            bold: selection.hasFormat('bold'),
            italic: selection.hasFormat('italic'),
            underline: selection.hasFormat('underline'),
            strikethrough: selection.hasFormat('strikethrough'),
          });
        }
      });
    });
  }, [editor]);

  return (
    <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
      <ToggleButton
        active={formats.bold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        label="Bold"
        icon={<span className="font-bold">B</span>}
      />
      <ToggleButton
        active={formats.italic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        label="Italic"
        icon={<span className="italic">I</span>}
      />
      <ToggleButton
        active={formats.underline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        label="Underline"
        icon={<span className="underline">U</span>}
      />
      <ToggleButton
        active={formats.strikethrough}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        label="Strikethrough"
        icon={<span className="line-through">S</span>}
      />
    </div>
  );
}