import { useState, useCallback, useEffect } from 'react';
import { deleteRoadmap, fetchRoadmapById, assignRoadmapToUser, fetchUserRoadmaps } from '../../services/roadmapService.js';
import { getAuthInfo } from '../../utils/authUtils.js';

export function useRoadmapManager() {
  const { getAuthInfo } = getAuthInfo();

  // Roadmap state
  const [existingRoadmap, setExistingRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [chatDisabled, setChatDisabled] = useState(false);

  const assignRoadmapToCurrentUser = useCallback(async (roadmapId) => {
    const { isAuthenticated, user_id, token } = getAuthInfo();
    if (!isAuthenticated || !roadmapId) return false;

    try {
      await assignRoadmapToUser(roadmapId, user_id, token);
      console.log('Roadmap assigned to user successfully');
      return true;
    } catch (error) {
      console.error('Failed to assign roadmap to user:', error);
      return false;
    }
  }, [getAuthInfo]);

  const updateTopicInRoadmap = useCallback((topicId, updates) => {
    setExistingRoadmap(prevRoadmap => {
      if (!prevRoadmap || !prevRoadmap.topics) return prevRoadmap;

      const updatedTopics = prevRoadmap.topics.map(topic => {
        if (topic.id === topicId) {
          return { ...topic, ...updates };
        }
        return topic;
      });

      return {
        ...prevRoadmap,
        topics: updatedTopics
      };
    });
  }, []);


  const setRoadmapData = useCallback(async (roadmapData, roadmapId) => {
    if (roadmapId) {
      localStorage.setItem('roadmapId', roadmapId);
    }
    
    setExistingRoadmap(roadmapData);
    setChatDisabled(true);

    // Try to assign to user if authenticated
    const { isAuthenticated } = getAuthInfo();
    if (isAuthenticated && roadmapId) {
      setTimeout(async () => {
        try {
          await assignRoadmapToCurrentUser(roadmapId);
        } catch (error) {
          console.error('Failed to assign roadmap immediately after creation:', error);
          // Retry after 2 seconds
          setTimeout(() => {
            assignRoadmapToCurrentUser(roadmapId);
          }, 2000);
        }
      }, 500);
    }
  }, [getAuthInfo, assignRoadmapToCurrentUser]);


  const resetRoadmapData = useCallback(async () => {
    const { isAuthenticated, token } = getAuthInfo();
    const roadmapId = localStorage.getItem('roadmapId');

    // Delete roadmap from server if authenticated
    if (isAuthenticated && roadmapId && token) {
      try {
        await deleteRoadmap(roadmapId, token);
        console.log('Roadmap deleted successfully');
      } catch (error) {
        console.error('Failed to delete roadmap:', error);
      }
    }

    // Reset all roadmap state
    setExistingRoadmap(null);
    setChatDisabled(false);
    setRoadmapLoading(false);

    // Clean up localStorage
    localStorage.removeItem("roadmapId");
  }, [getAuthInfo]);

  /**
   * Check for existing roadmaps on mount and auth changes
   */
  const checkForExistingRoadmap = useCallback(async () => {
    const roadmapId = localStorage.getItem('roadmapId');
    const { isAuthenticated, user_id, token } = getAuthInfo();

    setRoadmapLoading(true);

    try {
      // First priority: Check localStorage roadmapId
      if (roadmapId) {
        const roadmapData = await fetchRoadmapById(roadmapId, token);

        if (roadmapData) {
          setExistingRoadmap(roadmapData);
          setChatDisabled(true);
          return; // Found roadmap, we're done
        } else {
          // Roadmap doesn't exist anymore, clean up
          localStorage.removeItem('roadmapId');
        }
      }

      // Second priority: Check user's existing roadmaps if authenticated
      if (isAuthenticated && user_id) {
        const userRoadmap = await fetchUserRoadmaps(user_id, token);
        if (userRoadmap) {
          console.log('Found existing roadmap for logged in user');
          localStorage.setItem('roadmapId', userRoadmap.id.toString());
          setExistingRoadmap(userRoadmap);
          setChatDisabled(true);
        }
      }
    } catch (error) {
      console.error('Error checking for existing roadmap:', error);
    } finally {
      setRoadmapLoading(false);
    }
  }, [getAuthInfo]);

 // Handle auth state changes - check for roadmaps when user logs in/out

  const { isAuthenticated, user_id } = getAuthInfo();
  
  useEffect(() => {
    checkForExistingRoadmap();
  }, [checkForExistingRoadmap, isAuthenticated, user_id]);

  // Initial check on mount
  useEffect(() => {
    checkForExistingRoadmap();
  }, []);

  return {
    // State
    existingRoadmap,
    roadmapLoading,
    chatDisabled,
    
    // Operations
    updateTopicInRoadmap,
    setRoadmapData,
    resetRoadmapData,
    assignRoadmapToCurrentUser,
  };
}