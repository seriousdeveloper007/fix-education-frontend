import { useState, useEffect } from 'react';
import {
  ExternalLink,
  Clock,
  BookOpen,
  Calendar,
  Target,
  Play
} from 'lucide-react';

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
      className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(url)}
    >
      <div className="flex items-center gap-3">
        <img
          src={metadata.favicon}
          alt="favicon"
          className="w-5 h-5 rounded flex-shrink-0"
          onError={(e) => {
            e.target.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
          }}
        />
        <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors duration-150 flex-1 line-clamp-2">
          {metadata.title}
        </span>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-150" />
      </div>
    </div>
  );
};

const YouTubeVideoCard = ({ url, title, onClick }) => {
  const [videoTitle] = useState(title);
  const thumbnailUrl = getYouTubeThumbnail(url);

  return (
    <div
      className="w-fit bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(url, videoTitle)}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={videoTitle}
            className="h-48 w-auto object-cover transition-transform duration-200 group-hover:scale-105"
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
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-6 h-6" />
          </div>
        </div>
      </div>
      <h6 className="font-medium text-slate-800 text-sm leading-tight">
        {videoTitle}
      </h6>
    </div>
  );
};

const RoadMapUI = ({ title, topics }) => {
  const handleVideoClick = (videoLink) => {
    if (!videoLink) return;
    const url = `${window.location.origin}/study-room?video=${encodeURIComponent(videoLink)}&mode=play`;
    window.open(url, '_blank');
  };

  // Get week number from first topic (assuming all topics are from same week)
  const weekNumber = topics && topics.length > 0 ? topics[0].week_number : null;

  const topicTypeLabel = (type) => {
    if (type === 'learning_video') return 'Video lecture';
    if (type === 'question' || type === 'assignment') return 'Assignment';
    return null;
  };

  const handleResourceClick = (resourceLink) => {
    window.open(resourceLink, '_blank');
  };

  const sortedTopics = Array.isArray(topics)
    ? [...topics].sort((a, b) => a.topic_order - b.topic_order)
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight flex items-center">
            <Target className="text-3xl mr-3" />
            {title || 'Learning Roadmap'}
          </h1>
        </div>
        <div className="text-sm text-slate-700">
          {weekNumber && (
            <>
              <Calendar className="w-4 h-4 inline mr-1" />
              Week {weekNumber} |
            </>
          )}
          <BookOpen className="w-4 h-4 inline ml-2 mr-1" />
          Total Topics: {sortedTopics.length}
        </div>
      </div>

      {/* Single Week Content */}
      <div className="space-y-8">
        <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg p-6 transition-transform hover:-translate-y-1 hover:shadow-xl">
          {weekNumber && (
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-[#0284c7] to-[#22d3ee] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-3 shadow-lg">{weekNumber}</span>
              Week {weekNumber}
            </h2>
          )}

          <div className="space-y-6">
            {sortedTopics.map((topic, idx) => (
              <div key={`topic-${topic.topic_order}-${idx}`} className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Topic {topic.topic_order}: {topic.topic_name}
                    </h3>
                  </div>

                  {topic.duration_to_complete && (
                    <div className="flex-shrink-0">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {topic.duration_to_complete}
                      </span>
                    </div>
                  )}
                </div>

                {topicTypeLabel(topic.topic_type) && (
                  <div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 inline-flex w-fit">
                      {topicTypeLabel(topic.topic_type)}
                    </span>
                  </div>
                )}

                {/* Why Learn This Topic */}
                <div className="mb-6 mt-5">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Why learn this topic:
                  </h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {topic.why_learn_this_topic}
                  </p>
                </div>

                {/* Optional video section */}
                {topic.video_link && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Video Tutorial:
                    </h4>
                    <div className="w-full max-w-none">
                      <YouTubeVideoCard
                        url={topic.video_link}
                        title={topic.video_title}
                        onClick={handleVideoClick}
                      />
                    </div>
                  </div>
                )}

                {/* Optional resources section */}
                {Array.isArray(topic.resources) && topic.resources.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
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
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default RoadMapUI;