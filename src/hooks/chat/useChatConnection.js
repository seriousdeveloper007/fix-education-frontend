import { useRef } from 'react';
import { chatWebSocket } from '../../services/chatWebSocket';

export function useChatConnection({ onMessage, onToken, getPlaybackTime }) {
  const connectionRef = useRef(null);
  
  const { connect: wsConnect, sendMessage, close } = chatWebSocket({
    onMessage,
    onToken,
    getPlaybackTime
  });
  
  const connect = () => {
    if (!connectionRef.current) {
      wsConnect();
      connectionRef.current = true;
    }
  };
  
  const disconnect = () => {
    close();
    connectionRef.current = false;
  };
  
  return {
    connect,
    sendMessage,
    close: disconnect,
    isConnected: connectionRef.current
  };
}
