import posthog from 'posthog-js';

function getUserId() {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored).id : undefined;
  } catch {
    return undefined;
  }
}

function capture(event, properties = {}) {
  const user_id = getUserId();
  posthog.capture(event, { user_id, ...properties });
}

const analytics = {
  websiteLoaded: () => capture('website_loaded'), 
  loginPageLoaded: () => capture('login_page_loaded'),
  loginEmailSubmitted: (email) => capture('login_email_submitted', { email }),
  navbarOptionClicked: (option) => capture('navbar_option_clicked', { option }),
  sideNavbarOpened: (tab) => capture('side_navbar_opened', { tab }),
  sideNavbarClosed: (tab) => capture('side_navbar_closed', { tab }),
  doubtAsked: () => capture('doubt_asked'),
  questionAttempted: (questionId) => capture('question_attempted', { question_id: questionId }),
  libraryPageLoaded: () => capture('library_page_loaded'),
  libraryDetailPageLoaded: () => capture('library_detail_page_loaded'),
  youtubeLearningStarted: (url) => capture('youtube_learning_started', { url }),
  desktopViewLoaded: () => capture('desktop_view_loaded'),
  
  roadmapChatPageLoaded: () => capture('roadmap_chat_page_loaded'),
  roadmapChatStarted: () => capture('roadmap_chat_started'),
  roadmapMessageSent: (messageCount, sessionDuration) => capture('roadmap_message_sent', { 
    message_count: messageCount,
    session_duration_seconds: sessionDuration 
  }),
  roadmapAnalysisGenerated: (messageCount, timeTaken) => capture('roadmap_analysis_generated', { 
    messages_before_analysis: messageCount,
    time_to_analysis_seconds: timeTaken 
  }),
  roadmapCreationCompleted: (messageCount, totalTime) => capture('roadmap_creation_completed', { 
    total_messages: messageCount,
    total_time_seconds: totalTime 
  }),
  roadmapAbandoned: (lastStage, messageCount, timeSpent) => capture('roadmap_abandoned', { 
    last_stage: lastStage, // 'chat', 'analysis', 'roadmap'
    message_count: messageCount,
    time_spent_seconds: timeSpent 
  }),
  roadmapReset: (stage, messageCount) => capture('roadmap_reset', { 
    stage: stage, // 'chat', 'analysis', 'roadmap'
    message_count: messageCount 
  }),
  roadmapEdited: (editType, messageCount) => capture('roadmap_edited', { 
    edit_type: editType, // 'follow_up', 'requirement_change'
    messages_after_analysis: messageCount 
  }),
  roadmapVideoClicked: (videoUrl) => capture('roadmap_video_clicked', { video_url: videoUrl}),

  roadmapResourceClicked: (resourceUrl) => capture('roadmap_resource_clicked', {resource_url: resourceUrl}),
  
  userSignupTiming: (timing, hasRoadmap) => capture('user_signup_timing', { 
    timing: timing, // 'before_roadmap', 'after_roadmap'
    has_existing_roadmap: hasRoadmap 
  })

};

export default analytics;
