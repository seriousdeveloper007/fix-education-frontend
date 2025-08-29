import React, { useState, useEffect } from 'react';
import {
  Copy,
  ExternalLink,
  Clock,
  BookOpen,
  Calendar,
  Target,
  Play
} from 'lucide-react';
import themeConfig from '../config/themeConfig';


// Utility functions
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

const getFaviconUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
  }
};

// Resource metadata fetcher component
const ResourceItem = ({ url, onClick }) => {
  const [metadata, setMetadata] = useState({
    title: 'Loading...',
    favicon: getFaviconUrl(url)
  });

  useEffect(() => {
    const extractMetadata = () => {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        const path = urlObj.pathname;

        let title = domain;
        if (path && path !== '/') {
          const pathParts = path.split('/').filter(Boolean);
          if (pathParts.length > 0) {
            title = pathParts[pathParts.length - 1]
              .replace(/-/g, ' ')
              .replace(/_/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
          }
        }

        setMetadata({
          title: title.length > 60 ? title.substring(0, 60) + '...' : title,
          favicon: getFaviconUrl(url)
        });
      } catch {
        setMetadata({
          title: 'Resource Link',
          favicon: getFaviconUrl(url)
        });
      }
    };

    extractMetadata();
  }, [url]);

  return (
    <div
      className={themeConfig.roadmap.resourceItem}
      onClick={() => onClick(url)}
    >
      <div className={themeConfig.roadmap.resourceContent}>
        <img
          src={metadata.favicon}
          alt="favicon"
          className={themeConfig.roadmap.resourceFavicon}
          onError={(e) => {
            e.target.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
          }}
        />
        <span className={themeConfig.roadmap.resourceTitle}>
          {metadata.title}
        </span>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-150" />
      </div>
    </div>
  );
};

const YouTubeVideoCard = ({ url, title, onClick }) => {
  const [videoTitle, setVideoTitle] = useState(title);
  const thumbnailUrl = getYouTubeThumbnail(url);

  return (
    <div
      className={themeConfig.roadmap.videoContainer}
      onClick={() => onClick(url, videoTitle)}
    >
      <div className={themeConfig.roadmap.videoThumbnailContainer}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={videoTitle}
            className={themeConfig.roadmap.videoThumbnail}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x225/f0f0f0/666666?text=Video+Thumbnail';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
            <div className="text-gray-500 text-center">
              <Play className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Video Thumbnail</p>
            </div>
          </div>
        )}
        <div className={themeConfig.roadmap.videoPlayOverlay}>
          <div className={themeConfig.roadmap.videoPlayButton}>
            <Play className="w-6 h-6" />
          </div>
        </div>
      </div>
      <h6 className={themeConfig.roadmap.videoTitle}>
        {videoTitle}
      </h6>
    </div>
  );
};

const RoadMapUI = ({ roadmapData }) => {
  
  // Use provided data or fallback to sample data
  const data = roadmapData || sampleData;

  // Make sure we operate on `data.roadmap` (per schema)
  const topics = Array.isArray(data.topics) ? data.topics : [];
  // Group topics by week
  const topicsByWeek = topics.reduce((acc, topic) => {
    const week = topic.week_number;
    if (!acc[week]) acc[week] = [];
    acc[week].push(topic);
    return acc;
  }, {});

  // Sort topics within each week by topic_order
  Object.keys(topicsByWeek).forEach((week) => {
    topicsByWeek[week].sort((a, b) => a.topic_order - b.topic_order);
  });

  const handleVideoClick = (videoLink, topicName) => {
    if (!videoLink) return;
    const url = `${window.location.origin}/study-room?video=${encodeURIComponent(videoLink)}&mode=play`;
    window.open(url, '_blank');  // 👈 opens in new tab
  };
  

  const topicTypeLabel = (type) => {
    if (type === 'learning_video') return 'Video lecture';
    if (type === 'question') return 'Assignment';
    if (type === 'assignment') return 'Assignment'; // optional: handle assignment
    return null;
  };

  const handleResourceClick = (resourceLink) => {
    window.open(resourceLink, '_blank');
  };

  const totalWeeks =
    topics.length > 0 ? Math.max(...topics.map((t) => t.week_number)) : 0;

  return (
    <div className={themeConfig.roadmap.container}>
      {/* Header */}
      <div className={themeConfig.roadmap.header}>
        <div className={themeConfig.roadmap.titleContainer}>
          <h1 className={themeConfig.roadmap.title}>
            <Target className={themeConfig.roadmap.titleIcon} />
            {data.title || 'Learning Roadmap'}
          </h1>
        </div>
        <div className={themeConfig.roadmap.statsText}>
          <Calendar className="w-4 h-4 inline mr-1" />
          Total Weeks: {totalWeeks} |
          <BookOpen className="w-4 h-4 inline ml-2 mr-1" />
          Total Topics: {topics.length}
        </div>
      </div>

      {/* Roadmap Content */}
      <div className={themeConfig.roadmap.weekContainer}>
        {Object.keys(topicsByWeek)
          .sort((a, b) => Number(a) - Number(b))
          .map((week) => (
            <div key={week} className={themeConfig.roadmap.weekCard}>
              <h2 className={themeConfig.roadmap.weekHeader}>
                <span className={themeConfig.roadmap.weekBadge}>{week}</span>
                Week {week}
              </h2>

              <div className={themeConfig.roadmap.topicContainer}>
                {topicsByWeek[week].map((topic, idx) => (
                  <div key={`${week}-${topic.topic_order}-${idx}`} className={themeConfig.roadmap.topicCard}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={themeConfig.roadmap.topicTitle}>
                          Topic {topic.topic_order}: {topic.topic_name}
                        </h3>
                      </div>

                      {/* duration_to_complete is mandatory per schema, but keep guard for robustness */}
                      {topic.duration_to_complete && (
                        <div className="flex-shrink-0">
                          <span className={themeConfig.roadmap.durationBadge}>
                            <Clock className="w-4 h-4" />
                            {topic.duration_to_complete}
                          </span>
                        </div>
                      )}
                    </div>

                    {topicTypeLabel(topic.topic_type) && (
                      <div>
                        <span className={`${themeConfig.roadmap.typeBadge} inline-flex w-fit`}>
                          {topicTypeLabel(topic.topic_type)}
                        </span>
                      </div>
                    )}

                    {/* Why Learn This Topic */}
                    <div className="mb-6 mt-5">
                      <h4 className={themeConfig.roadmap.sectionTitle}>
                        <BookOpen className="w-4 h-4" />
                        Why learn this topic:
                      </h4>
                      <p className={themeConfig.roadmap.description}>
                        {topic.why_learn_this_topic}
                      </p>
                    </div>

                    {/* Optional video section */}
                    {topic.video_link && (
                      <div className="mb-6">
                        <h4 className={themeConfig.roadmap.sectionTitle}>
                          <Play className="w-4 h-4" />
                          Video Tutorial:
                        </h4>
                        <div className="w-full max-w-none">
                          <YouTubeVideoCard
                            url={topic.video_link}
                            title={topic.video_title} // optional
                            onClick={handleVideoClick}
                          />
                        </div>
                      </div>
                    )}

                    {/* Optional resources section */}
                    {Array.isArray(topic.resources) && topic.resources.length > 0 && (
                      <div className={themeConfig.roadmap.resourceSection}>
                        <h4 className={themeConfig.roadmap.sectionTitle}>
                          <ExternalLink className="w-4 h-4" />
                          Resources:
                        </h4>

                        <div className="space-y-2">
                          {topic.resources.map((resource, index) => (
                            <ResourceItem
                              key={index}
                              url={resource}
                              onClick={handleResourceClick}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optional assignment links section */}
                    {Array.isArray(topic.assignment_links) && topic.assignment_links.length > 0 && (
                      <div className={themeConfig.roadmap.resourceSection}>
                        <h4 className={themeConfig.roadmap.sectionTitle}>
                          <ExternalLink className="w-4 h-4" />
                          Assignments:
                        </h4>

                        <div className="space-y-2">
                          {topic.assignment_links.map((link, index) => (
                            <ResourceItem
                              key={index}
                              url={link}
                              onClick={handleResourceClick}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoadMapUI;