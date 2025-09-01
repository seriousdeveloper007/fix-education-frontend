import { useCallback } from 'react';
import { chatService } from '../../services/chatService';

export function useChatHistory() {
  const loadHistory = useCallback(async () => {
    const chatId = localStorage.getItem('chatId');
    if (!chatId) return [];
    
    try {
      const data = await chatService.loadChatMessages(chatId);
      
      // Transform messages to component format
      const messages = (data.messages || []).map((m) => ({
        role: m.message_from === 'assistant' ? 'agent' : 'user',
        text: m.text,
        images: Array.isArray(m.images) ? m.images : [],
      }));
      
      return messages;
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }, []);
  
  return { loadHistory };
}