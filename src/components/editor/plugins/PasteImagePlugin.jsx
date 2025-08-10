import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_LOW, $insertNodes, PASTE_COMMAND } from 'lexical';
import { uploadNoteImage } from '../../../services/imageService';
import { $generateNodesFromDOM } from '@lexical/html';

export default function PasteImagePlugin({ tabId, noteId, onUploaded }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      async (event) => {
        // Only handle if clipboard contains images; otherwise keep default paste
        const clipboard = event.clipboardData;
        if (!clipboard) return false;
        const items = Array.from(clipboard.items || []);
        const imageFiles = items
          .filter((it) => it.kind === 'file')
          .map((it) => it.getAsFile())
          .filter((f) => f && f.type?.startsWith('image/'));

        if (imageFiles.length === 0) return false; // let text paste work normally
        if (!noteId) return true; // prevent default until note exists (avoid inserting raw data)

        event.preventDefault();
        for (const file of imageFiles) {
          try {
            const { url } = await uploadNoteImage(tabId, noteId, file);
            onUploaded?.(url);
            editor.update(() => {
              const parser = new DOMParser();
              const dom = parser.parseFromString(`<img src="${url}" alt=""/>`, 'text/html');
              const nodes = $generateNodesFromDOM(editor, dom);
              $insertNodes(nodes);
            });
          } catch (e) {
            console.error('image upload error', e);
          }
        }
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, tabId, noteId, onUploaded]);

  return null;
}
