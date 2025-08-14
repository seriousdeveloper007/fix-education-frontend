import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND } from 'lexical';
import { $createImageNode } from './ImageNode';
import { uploadImage } from '../../../services/imageService';

export default function PasteImagePlugin({ tabId, noteId }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      async (event) => {
        const files = event.clipboardData?.files;
        if (!files || files.length === 0) return false;

        event.preventDefault();
        for (const file of files) {
          if (!file.type.startsWith('image/')) continue;

          // Validate size (10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert('Image exceeds 10MB limit');
            continue;
          }

          try {
            // Upload via FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('alt_text', file.name || 'Pasted image');

            editor.update(() => {
              editor.setEditable(false); // Lock during upload
            });

            const response = await uploadImage(tabId, noteId, formData);
            const { url, id, alt_text } = response;

            editor.update(() => {
              const node = $createImageNode({
                src: url, // Signed URL
                altText: alt_text,
                imageId: id, // For deletion
              });
              editor.getRoot().append(node);
              editor.setEditable(true);
            });
          } catch (error) {
            editor.update(() => {
              editor.setEditable(true);
            });
            console.error('Image upload failed:', error);
          }
        }
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, tabId, noteId]);

  return null;
}