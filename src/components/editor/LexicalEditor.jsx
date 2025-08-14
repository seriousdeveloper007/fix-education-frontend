import { useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes } from 'lexical';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import PasteImagePlugin from './plugins/PasteImagePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { ImageNode } from './plugins/ImageNode';

// HydratePlugin for document_state - deferred to avoid flushSync warning
function HydratePlugin({ documentState }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (!documentState) return;

    // Defer the state update to avoid flushSync warning
    const timeoutId = setTimeout(() => {
      const hasValidRoot = documentState.root && 
                          documentState.root.children && 
                          documentState.root.children.length > 0;
      
      if (hasValidRoot) {
        try {
          // Parse and set the editor state which includes ImageNodes
          const editorState = editor.parseEditorState(documentState);
          editor.setEditorState(editorState);
          console.log('Successfully restored editor state with images');
        } catch (error) {
          console.error('Failed to restore editor state:', error);
          
          // Fallback: try to restore from HTML if JSON parsing fails
          if (documentState.html) {
            editor.update(() => {
              try {
                const parser = new DOMParser();
                const dom = parser.parseFromString(documentState.html, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);
                if (nodes && nodes.length > 0) {
                  $getRoot().clear();
                  $insertNodes(nodes);
                }
              } catch (htmlError) {
                console.error('Failed to restore from HTML:', htmlError);
              }
            });
          }
        }
      } else if (documentState.html && documentState.html.length > 0) {
        // If no valid JSON state but we have HTML, use that
        editor.update(() => {
          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(documentState.html, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            if (nodes && nodes.length > 0) {
              $getRoot().clear();
              $insertNodes(nodes);
            }
          } catch (htmlError) {
            console.error('Failed to restore from HTML:', htmlError);
          }
        });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [editor, documentState]);

  return null;
}

// Main LexicalEditor wrapper component
function EditorContent({ initialDocState, tabId, noteId, onChange }) {
  const [editor] = useLexicalComposerContext();

  // Properly handle onChange with correct HTML generation
  const handleChange = useCallback((editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const plainText = root.getTextContent();
      
      // Generate HTML from nodes (this properly handles ImageNodes)
      let html = '';
      try {
        html = $generateHtmlFromNodes(editor, null);
      } catch (e) {
        console.error('Failed to generate HTML:', e);
        // Fallback to DOM innerHTML if available
        const dom = editor.getRootElement();
        if (dom) {
          html = dom.innerHTML || '';
        }
      }
      
      // Get the full editor state as JSON (this includes ImageNodes with all their properties)
      const editorStateJSON = editorState.toJSON();
      
      // Debug log to verify images are in the state
      const hasImages = JSON.stringify(editorStateJSON).includes('"type":"image"');
      if (hasImages) {
        console.log('Editor state contains images, saving...');
      }
      
      onChange({ 
        plain_text: plainText, 
        html: html || '', 
        document_state: editorStateJSON 
      });
    });
  }, [editor, onChange]);

  return (
    <>
      <div className="relative w-full h-full flex flex-col">
        <ToolbarPlugin />
        <div className="flex-1 overflow-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none p-4 text-base min-h-full" />
            }
            placeholder={
              <div className="text-gray-400 text-base absolute top-4 left-4 pointer-events-none">
                Start typing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <PasteImagePlugin tabId={tabId} noteId={noteId} />
        <OnChangePlugin onChange={handleChange} />
        {initialDocState && <HydratePlugin documentState={initialDocState} />}
      </div>
    </>
  );
}

// Main LexicalEditor component
export default function LexicalEditor({ initialDocState, tabId, noteId, onChange }) {
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
      image: 'editor-image', // Add theme for images
    },
    nodes: [ImageNode], // Register ImageNode
    onError: (error) => console.error('Lexical error:', error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent 
        initialDocState={initialDocState}
        tabId={tabId}
        noteId={noteId}
        onChange={onChange}
      />
    </LexicalComposer>
  );
}