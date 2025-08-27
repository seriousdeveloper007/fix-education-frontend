import { useState, useRef, useCallback, useEffect } from 'react';
import { useRoadmapWebSocket } from "../../services/RoadmapWebSocket";
import { fetchRoadmapMessages } from "../../services/roadmapMessageService.js";
import { useAuth } from './useAuth.js';

export function useWebSocketChat({ onTopicUpdate, onRoadmapCreate }) {
  const { getAuthInfo } = useAuth();

  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Chat refs
  const hasConnectedRef = useRef(false);
  const messageContainerRef = useRef(null);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback(async (msg) => {
    setIsLoading(false);

    // Handle topic updates (video links, assignments, etc.)
    if (typeof msg === "object" && msg && msg.topic_id && (msg.video_link || msg.assignment_links)) {
      const updates = {};
      if (msg.video_link) updates.video_link = msg.video_link;
      if (msg.video_title) updates.video_title = msg.video_title;
      if (msg.assignment_links) updates.assignment_links = msg.assignment_links;

      // Call the roadmap manager to update the topic
      if (onTopicUpdate) {
        onTopicUpdate(msg.topic_id, updates);
      }

      // Also update any roadmaps in messages
      setMessages(prevMessages => {
        return prevMessages.map(msgItem => {
          if (msgItem.type === 'roadmap' && msgItem.roadmap) {
            const updatedTopics = msgItem.roadmap.topics.map(topic => {
              if (topic.id === msg.topic_id) {
                return { ...topic, ...updates };
              }
              return topic;
            });

            return {
              ...msgItem,
              roadmap: {
                ...msgItem.roadmap,
                topics: updatedTopics
              }
            };
          }
          return msgItem;
        });
      });
      return;
    }

    // Handle complete roadmap creation
    if (typeof msg === "object" && msg && msg.roadmap_id && msg.roadmap) {
      // Call the roadmap manager to set the new roadmap
      if (onRoadmapCreate) {
        onRoadmapCreate(msg.roadmap, msg.roadmap_id);
      }

      // Add roadmap message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          type: "roadmap",
          roadmap: msg.roadmap,
        }
      ]);
      return;
    }

    // Handle object messages (usually status updates)
    if (typeof msg === "object" && msg !== null) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: msg.message ?? JSON.stringify(msg) }
      ]);

      // Set loading for continued processing
      setTimeout(() => {
        setIsLoading(true);
      }, 1000);
      return;
    }

    // Handle streaming text messages
    setMessages((prev) => {
      const last = prev[prev.length - 1];

      if (!last || last.role === "user") {
        // Create new agent message
        return [...prev, { role: "agent", text: msg }];
      } else {
        // Append to existing agent message
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          text: (last.text || "") + msg,
        };
        return updated;
      }
    });
  }, [onTopicUpdate, onRoadmapCreate]);

  // Initialize WebSocket connection
  const { sendMessage, connect, close } = useRoadmapWebSocket({
    onMessage: handleWebSocketMessage
  });

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsLoading(true);

    // Get auth info for the message
    const { user_id, token } = getAuthInfo();
    const payload = { 
      text: trimmed, 
      message_type: 'text',
      ...(user_id && token && { user_id, auth_token: token })
    };

    // Connect and send message
    if (!hasConnectedRef.current) {
      connect();
      hasConnectedRef.current = true;

      // Delay first message to allow connection
      setTimeout(() => {
        sendMessage(payload);
      }, 3000);
    } else {
      sendMessage(payload);
    }
  }, [input, connect, sendMessage, getAuthInfo]);

  // Reset all chat state and close connections
  
  const resetChatState = useCallback(() => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
    setIsFocused(false);
    hasConnectedRef.current = false;
    
    // Clean up chat storage
    localStorage.removeItem("chatRoadmapId");
    
    // Close WebSocket connection
    close();
  }, [close]);

 // Load existing messages from localStorage on mount
   
  useEffect(() => {
    const chatRoadmapId = localStorage.getItem('chatRoadmapId');
    if (!chatRoadmapId) return;

    fetchRoadmapMessages(chatRoadmapId)
      .then((loaded) => setMessages(loaded))
      .catch((err) => {
        console.error('Failed to load messages', err);
      });
  }, []);

  return {
    // State
    messages,
    input,
    setInput,
    isLoading,
    isFocused,
    setIsFocused,
    
    // Refs
    messageContainerRef,
    
    // Operations
    handleSend,
    resetChatState,
    
    // Computed
    hasMessages: messages.length > 0,
  };
}