import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_LOW, INSERT_TEXT_COMMAND, $insertNodes, PASTE_COMMAND } from 'lexical';
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

        // If there's HTML, insert as nodes
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

        // Fallback: plain text
        if (text) {
          event.preventDefault();
          editor.dispatchCommand(INSERT_TEXT_COMMAND, text);
          return true;
        }

        return false; // let others handle if nothing we understand
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
