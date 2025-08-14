// components/editor/plugins/PasteTextPlugin.jsx
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_LOW,
  PASTE_COMMAND,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
} from 'lexical';
import { $generateNodesFromDOM } from '@lexical/html';

export default function PasteTextPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const cd = event.clipboardData;
        if (!cd) return false;

        const html = cd.getData('text/html');
        const text = cd.getData('text/plain');

        // Prefer HTML if available
        if (html) {
          event.preventDefault();
          editor.update(() => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nodes = $generateNodesFromDOM(editor, doc);
            $insertNodes(nodes);
          });
          return true;
        }

        // Fallback to plain text
        if (text) {
          event.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertText(text);
            }
          });
          return true;
        }

        return false; // nothing we handle; let others try
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
