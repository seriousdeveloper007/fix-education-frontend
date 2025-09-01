import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND, $getRoot, $getSelection } from 'lexical';
import { $createImageNode } from './ImageNode';
import { uploadImage } from '../../../services/notesImageService';

export default function PasteImagePlugin({ tabId, noteId }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!noteId) {
      console.warn('PasteImagePlugin: No noteId provided, image paste disabled');
      return;
    }

    const removeCommand = editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const files = event.clipboardData?.files;
        if (!files || files.length === 0) return false;

        // Check if any files are images
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return false;

        event.preventDefault();
        
        // Process each image file
        imageFiles.forEach(async (file) => {
          if (file.size > 10 * 1024 * 1024) {
            alert('Image exceeds 10MB limit');
            return;
          }

          // Show loading state
          editor.setEditable(false);
          
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('alt_text', file.name || 'Pasted image');

            console.log('Uploading image to backend...');
            const response = await uploadImage(tabId, noteId, formData);
            const { url, id, alt_text } = response;
            
            console.log('Image uploaded successfully:', { url, id, alt_text });

            // Insert the image node into the editor
            editor.update(() => {
              const selection = $getSelection();
              const imageNode = $createImageNode({
                src: url,
                altText: alt_text,
                imageId: id,
              });
              
              if (selection) {
                selection.insertNodes([imageNode]);
              } else {
                // If no selection, append to root
                $getRoot().append(imageNode);
              }
              
              console.log('Image node inserted into editor');
            });

            // Force a change event to save the state
            setTimeout(() => {
              editor.dispatchCommand('FORCE_UPDATE', undefined);
            }, 100);
            
          } catch (error) {
            console.error('Image upload failed:', error);
            alert(error.message || 'Failed to upload image');
          } finally {
            // Always re-enable editing
            editor.setEditable(true);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    // Cleanup
    return () => {
      removeCommand();
    };
  }, [editor, tabId, noteId]);

  return null;
}