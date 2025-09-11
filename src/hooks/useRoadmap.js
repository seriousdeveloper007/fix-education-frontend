import { useState, useEffect, useCallback } from 'react';
import { 
  getRoadmapStatus, 
  getUserRoadmapLessons, 
  createRoadmapFromMessage, 
  deleteUserRoadmap,
  completeMiniLesson,
  getMiniLessonByTopic
} from '../services/roadmapService';

export function useRoadmap() {
  const [roadmapState, setRoadmapState] = useState({
    hasRoadmap: false,
    roadmapData: null,
    activeLessons: [],
    futureLessons: [],
    isLoading: true,
    error: null,
    isFromCache: false
  });

  // Check roadmap status on hook initialization
  const checkRoadmapStatus = useCallback(async () => {
    try {
      setRoadmapState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const status = await getRoadmapStatus();
      
      if (status.has_roadmap) {
        // User has roadmap, fetch full data
        await loadRoadmapData();
      } else {
        // No roadmap found
        setRoadmapState(prev => ({
          ...prev,
          hasRoadmap: false,
          roadmapData: null,
          activeLessons: [],
          futureLessons: [],
          isLoading: false,
          isFromCache: status.from_cache || false
        }));
      }
    } catch (error) {
      console.error('Error checking roadmap status:', error);
      setRoadmapState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  }, []);

  // Load complete roadmap data
  const loadRoadmapData = useCallback(async () => {
    try {
      const data = await getUserRoadmapLessons();
      
      if (data) {
        setRoadmapState(prev => ({
          ...prev,
          hasRoadmap: true,
          roadmapData: data.roadmap,
          activeLessons: data.active_lessons || [],
          futureLessons: data.future_lessons || [],
          isLoading: false,
          error: null
        }));
      } else {
        // Roadmap was deleted or doesn't exist
        setRoadmapState(prev => ({
          ...prev,
          hasRoadmap: false,
          roadmapData: null,
          activeLessons: [],
          futureLessons: [],
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error loading roadmap data:', error);
      setRoadmapState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  }, []);

  // Create roadmap from chat message (finalization)
  const finalizeRoadmap = useCallback(async (messageId, miniLessonTopic) => {
    try {
      setRoadmapState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('Finalizing roadmap...');
      
      const roadmap = await createRoadmapFromMessage(messageId, miniLessonTopic);
      
      console.log('Roadmap created:', roadmap);
      
      if (roadmap) {
        // Reload complete roadmap data
        await loadRoadmapData();
        return roadmap;
      }
    } catch (error) {
      console.error('Error finalizing roadmap:', error);
      setRoadmapState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
      throw error;
    }
  }, [loadRoadmapData]);

  // Delete roadmap and start over
  const resetRoadmap = useCallback(async () => {
    try {
      setRoadmapState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await deleteUserRoadmap();
      
      setRoadmapState(prev => ({
        ...prev,
        hasRoadmap: false,
        roadmapData: null,
        activeLessons: [],
        futureLessons: [],
        isLoading: false,
        error: null
      }));
      
      return true;
    } catch (error) {
      console.error('Error resetting roadmap:', error);
      setRoadmapState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
      throw error;
    }
  }, []);

  // Complete a mini-lesson and refresh data
  const markMiniLessonComplete = useCallback(async (miniLessonId) => {
    try {
      await completeMiniLesson(miniLessonId);
      
      // Refresh roadmap data to show updated progress
      await loadRoadmapData();
      
      return true;
    } catch (error) {
      console.error('Error completing mini-lesson:', error);
      setRoadmapState(prev => ({
        ...prev,
        error: error.message
      }));
      throw error;
    }
  }, [loadRoadmapData]);

  // Find mini-lesson by topic name (for URL transition)
  const findMiniLessonByTopic = useCallback(async (topicName) => {
    try {
      const result = await getMiniLessonByTopic(topicName);
      return result;
    } catch (error) {
      console.error('Error finding mini-lesson by topic:', error);
      throw error;
    }
  }, []);

  // Helper function to get mini-lessons for a specific lesson
  const getMiniLessonsForLesson = useCallback((lessonId) => {
    const lessonData = roadmapState.activeLessons.find(
      item => item.lesson.id === lessonId
    );
    return lessonData ? lessonData.mini_lessons : [];
  }, [roadmapState.activeLessons]);

  // Helper function to check if all mini-lessons in a lesson are completed
  const isLessonCompleted = useCallback((lessonId) => {
    const miniLessons = getMiniLessonsForLesson(lessonId);
    return miniLessons.length > 0 && miniLessons.every(ml => ml.status === 'completed');
  }, [getMiniLessonsForLesson]);

  // Helper function to get current lesson
  const getCurrentLesson = useCallback(() => {
    return roadmapState.activeLessons.find(
      item => item.lesson.status === 'current'
    );
  }, [roadmapState.activeLessons]);

  // Helper function to get completed lessons
  const getCompletedLessons = useCallback(() => {
    return roadmapState.activeLessons.filter(
      item => item.lesson.status === 'completed'
    );
  }, [roadmapState.activeLessons]);

  // Initialize roadmap status on mount
  useEffect(() => {
    checkRoadmapStatus();
  }, [checkRoadmapStatus]);

  return {
    // State
    hasRoadmap: roadmapState.hasRoadmap,
    roadmapData: roadmapState.roadmapData,
    activeLessons: roadmapState.activeLessons,
    futureLessons: roadmapState.futureLessons,
    isLoading: roadmapState.isLoading,
    error: roadmapState.error,
    isFromCache: roadmapState.isFromCache,

    // Actions
    checkRoadmapStatus,
    loadRoadmapData,
    finalizeRoadmap,
    resetRoadmap,
    markMiniLessonComplete,
    findMiniLessonByTopic,

    // Helpers
    getMiniLessonsForLesson,
    isLessonCompleted,
    getCurrentLesson,
    getCompletedLessons,
  };
}