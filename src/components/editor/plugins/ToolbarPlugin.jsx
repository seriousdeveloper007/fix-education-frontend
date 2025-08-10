import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';

function ToggleButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border ${
        active ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-slate-200'
      } hover:bg-emerald-50`}
      aria-pressed={active}
    >
      {label}
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
    <div className="flex items-center gap-1 p-1 border border-slate-200 rounded-lg bg-white">
      <ToggleButton
        active={formats.bold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        label="B"
      />
      <ToggleButton
        active={formats.italic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        label="I"
      />
      <ToggleButton
        active={formats.underline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        label="U"
      />
      <ToggleButton
        active={formats.strikethrough}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        label="S"
      />
    </div>
  );
}
