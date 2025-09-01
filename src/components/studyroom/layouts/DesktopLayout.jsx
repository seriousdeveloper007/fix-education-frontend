import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StudyRoomNavbar from '../StudyRoomNavbar';
import SidePanel from '../SidePanel';
import analytics from '../../../services/posthogService';

export function DesktopLayout({ 
  videoUrl,
  videoId,
  startTime,
  iframeRef,
  pause,
  getCurrentTime,
  getDuration,
  unattemptedQuestionCount,
  updateQuestionCount
}) {
  const [sidePanelTab, setSidePanelTab] = useState(null);
  const isSidePanelOpen = !!sidePanelTab;

  // Auto-open panel on desktop
  useEffect(() => {
    setSidePanelTab('Ask Doubt');
  }, []);

  return (
    <>
      <StudyRoomNavbar 
        videoUrl={videoUrl}
        onTabSelect={(tab) => {
          pause();
          setSidePanelTab(tab);
          analytics.sideNavbarOpened(tab);
        }}
        unattemptedQuestionCount={unattemptedQuestionCount}
        getCurrentTime={getCurrentTime}
        getDuration={getDuration}
        selectedTab={sidePanelTab}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${startTime}`}
          title="YouTube video"
          className={`${isSidePanelOpen ? 'w-2/3' : 'w-full'} h-full`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {isSidePanelOpen && (
          <SidePanel
            tab={sidePanelTab}
            onClose={() => {
              analytics.sideNavbarClosed(sidePanelTab);
              setSidePanelTab(null);
            }}
            getCurrentTime={getCurrentTime}
            updateQuestionCount={updateQuestionCount}
          />
        )}
      </div>
    </>
  );
}

DesktopLayout.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  iframeRef: PropTypes.object.isRequired,
  pause: PropTypes.func.isRequired,
  getCurrentTime: PropTypes.func.isRequired,
  getDuration: PropTypes.func.isRequired,
  unattemptedQuestionCount: PropTypes.number.isRequired,
  updateQuestionCount: PropTypes.func.isRequired
};