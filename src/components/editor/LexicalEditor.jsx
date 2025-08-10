import React, { useEffect, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import PasteImagePlugin from './plugins/PasteImagePlugin';
import PasteTextPlugin from './plugins/PasteTextPlugin';
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function HydrateFromJSON({ initialDocState }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!initialDocState) return;
    editor.update(() => {
      try {
        const parsed = editor.parseEditorState(initialDocState);
        editor.setEditorState(parsed);
      } catch (e) {
        console.error('Failed to hydrate editor state', e);
      }
    });
  }, [initialDocState, editor]);
  return null;
}

export default function LexicalEditor({
  initialDocState,
  tabId,
  noteId,
  onChange, // ({ plain_text, html, document_state })
}) {
  const theme = useMemo(
    () => ({
      paragraph: 'text-slate-800 leading-relaxed mb-2',
      quote: 'pl-4 border-l-2 border-slate-300 italic text-slate-600',
      heading: 'font-semibold my-2',
      list: 'list-disc list-inside ml-4',
      listitem: 'mb-1',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
      },
    }),
    []
  );

  const initialConfig = useMemo(
    () => ({
      namespace: 'NoteEditor',
      theme,
      onError(error) {
        console.error('Lexical error', error);
      },
      editable: true,
    }),
    [theme]
  );

  const handleChange = (editorState, editor) => {
    editorState.read(() => {
      const plain_text = $getRoot().getTextContent();
      const html = $generateHtmlFromNodes(editor);
      const document_state = editorState.toJSON();
      onChange?.({ plain_text, html, document_state });
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/* Fill height; toolbar fixed; content scrolls */}
      <div className="h-full flex flex-col gap-2">
        <ToolbarPlugin />
        <div className="relative flex-1 min-h-0 overflow-auto">
          <RichTextPlugin
            contentEditable={
              <div className="rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500">
                <ContentEditable className="w-full min-h-[240px] outline-none p-3" />
              </div>
            }
            placeholder={
              <div className="absolute left-3 top-3 text-slate-400 pointer-events-none">
                Type your notes here and they will be autosaved in library. You can paste
                screenshots and images.
              </div>
            }
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <HydrateFromJSON initialDocState={initialDocState} />
        <PasteTextPlugin />
        <PasteImagePlugin tabId={tabId} noteId={noteId} />
      </div>
    </LexicalComposer>
  );
}
