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
  doubtAsked: () => capture('doubt_asked'),
  questionAttempted: (questionId) => capture('question_attempted', { question_id: questionId }),
  libraryPageLoaded: () => capture('library_page_loaded'),
  libraryDetailPageLoaded: () => capture('library_detail_page_loaded'),
  youtubeLearningStarted: (url) => capture('youtube_learning_started', { url }),
  desktopViewLoaded: () => capture('desktop_view_loaded'),
};

export default analytics;
