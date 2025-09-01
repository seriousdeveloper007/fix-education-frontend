import { useState, useCallback, useEffect, useRef } from 'react';
import { imageService } from '../../services/imageService';

export function useChatInput() {
  const [input, setInput] = useState('');
  const [attachedImages, setAttachedImages] = useState([]);
  const [error, setError] = useState('');
  const errorTimerRef = useRef(null);
  
  const showError = useCallback((msg) => {
    clearTimeout(errorTimerRef.current);
    setError(msg);
    errorTimerRef.current = setTimeout(() => setError(''), 2200);
  }, []);
  
  const handlePaste = useCallback(async (e) => {
    const items = e.clipboardData?.items || [];
    const imgItem = Array.from(items).find((it) => it.type?.startsWith('image/'));
    if (!imgItem) return;
    
    if (attachedImages.length >= 1) {
      showError('Only one image is allowed. Remove the current one to paste another.');
      e.preventDefault();
      return;
    }
    
    const file = imgItem.getAsFile();
    if (!file) return;
    
    e.preventDefault();
    try {
      const imageObject = await imageService.createImageObject(file);
      setAttachedImages(prev => [...prev, imageObject]);
    } catch {
      showError('Could not read the pasted image.');
    }
  }, [attachedImages.length, showError]);
  
  const removeImage = useCallback((idx) => {
    setAttachedImages(prev => {
      const next = [...prev];
      const [removed] = next.splice(idx, 1);
      imageService.revokeImageUrl(removed);
      return next;
    });
  }, []);
  
  const clearInput = useCallback(() => {
    setInput('');
    attachedImages.forEach(img => imageService.revokeImageUrl(img));
    setAttachedImages([]);
  }, [attachedImages]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      attachedImages.forEach(img => imageService.revokeImageUrl(img));
    };
  }, []);
  
  return {
    input,
    setInput,
    attachedImages,
    setAttachedImages,
    error,
    showError,
    handlePaste,
    removeImage,
    clearInput
  };
}