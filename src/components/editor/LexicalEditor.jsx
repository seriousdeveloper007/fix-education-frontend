import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';
import PasteImagePlugin from './plugins/PasteImagePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { ImageNode } from './plugins/ImageNode';

// Component to handle hydration from saved document state
function HydratePlugin({ documentState }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (!documentState) return;

    // Check if documentState has valid content
    const hasValidRoot = documentState.root && 
                        documentState.root.children && 
                        documentState.root.children.length > 0;
    
    // Only attempt to restore if we have valid content
    if (hasValidRoot) {
      try {
        const editorState = editor.parseEditorState(documentState);
        editor.setEditorState(editorState);
      } catch (error) {
        console.error('Failed to restore editor state:', error);
        // If restoration fails, try HTML fallback
        if (documentState.html) {
          editor.update(() => {
            try {
              const parser = new DOMParser();
              const dom = parser.parseFromString(documentState.html, 'text/html');
              const nodes = $generateNodesFromDOM(editor, dom);
              if (nodes && nodes.length > 0) {
                $getRoot().clear().append(...nodes);
              }
            } catch (htmlError) {
              console.error('Failed to restore from HTML:', htmlError);
            }
          });
        }
      }
    } else if (documentState.html && documentState.html.trim()) {
      // If no valid root but we have HTML, try to restore from HTML
      editor.update(() => {
        try {
          const parser = new DOMParser();
          const dom = parser.parseFromString(documentState.html, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          if (nodes && nodes.length > 0) {
            $getRoot().clear().append(...nodes);
          }
        } catch (error) {
          console.error('Failed to hydrate from HTML:', error);
        }
      });
    }
    // If neither valid root nor HTML, leave editor empty (default state)
  }, [editor, documentState]);

  return null;
}

// Inner editor component that has access to the editor context
function EditorContent({ initialDocState, tabId, noteId, onChange }) {
  return (
    <>
      <ToolbarPlugin />
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg bg-white">
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="outline-none p-4 text-base min-h-[400px] leading-relaxed" 
            />
          }
          placeholder={
            <div className="text-gray-400 text-base absolute top-4 left-4 pointer-events-none">
              Start typing your notes...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <PasteImagePlugin tabId={tabId} noteId={noteId} />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const root = $getRoot();
            const plainText = root.getTextContent();
            
            // Generate proper HTML representation
            let html = '';
            const children = root.getChildren();
            children.forEach(child => {
              const childHTML = child.getTextContent();
              if (childHTML) {
                html += `<p>${childHTML}</p>`;
              }
            });
            
            // Only call onChange if we have actual content changes
            const editorStateJSON = editorState.toJSON();
            onChange({ 
              plain_text: plainText, 
              html: html || '', 
              document_state: editorStateJSON 
            });
          });
        }}
      />
      {initialDocState && <HydratePlugin documentState={initialDocState} />}
    </>
  );
}

export default function LexicalEditor({ initialDocState, tabId, noteId, onChange }) {
  // Default onChange to prevent errors
  const handleChange = onChange || (() => {});
  
  const initialConfig = {
    namespace: 'MyEditor',
    theme: {
      paragraph: 'mb-2 text-base leading-relaxed',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
      },
      heading: {
        h1: 'text-2xl font-bold mb-3',
        h2: 'text-xl font-bold mb-2',
        h3: 'text-lg font-bold mb-2',
      },
    },
    nodes: [ImageNode], // Register the ImageNode with Lexical
    onError: (error) => console.error('Lexical error:', error),
    // Don't set initial editor state here, let HydratePlugin handle it
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full h-full flex flex-col">
        <EditorContent
          initialDocState={initialDocState}
          tabId={tabId}
          noteId={noteId}
          onChange={handleChange}
        />
      </div>
    </LexicalComposer>
  );
}