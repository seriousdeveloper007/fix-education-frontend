import { useState, useEffect } from 'react';
import {
  ExternalLink,
  Clock,
  BookOpen,
  Calendar,
  Target,
  Play,
  Eye,
  ArrowRight
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
      className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-md border border-white/50 rounded-xl p-4 hover:shadow-xl hover:border-white/70 hover:from-white to-white/95 transition-all duration-300 cursor-pointer group transform hover:-translate-y-0.5"
      onClick={() => onClick(url)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200/50">
          <img
            src={metadata.favicon}
            alt="favicon"
            className="w-5 h-5 rounded"
            onError={(e) => {
              e.target.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=32';
            }}
          />
        </div>
        <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors duration-200 flex-1 line-clamp-2 leading-relaxed">
          {metadata.title}
        </span>
        <div className="flex-shrink-0 p-1.5 rounded-lg bg-slate-50/80 group-hover:bg-slate-100 transition-colors duration-200">
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
};

const YouTubeVideoCard = ({ url, title, onClick }) => {
  const [videoTitle] = useState(title);
  const thumbnailUrl = getYouTubeThumbnail(url);

  return (
    <div
      className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:shadow-2xl hover:border-white/70"
      onClick={() => onClick(url, videoTitle)}
    >
      <div className="relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={videoTitle}
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x225/f0f0f0/666666?text=Video+Thumbnail';
            }}
          />
        ) : (
          <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-slate-500 text-center">
              <Play className="w-12 h-12 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">Video Thumbnail</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm">
              <Play className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h6 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">
          {videoTitle}
        </h6>
      </div>
    </div>
  );
};

// Next Modules Component
const NextModulesCard = ({ nextModules }) => {
  if (!Array.isArray(nextModules) || nextModules.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/60 border-b border-white/30 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white p-1" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex-1">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Next Modules
              </span>
            </h2>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md border border-indigo-200/50">
              {nextModules.length} Modules
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid gap-4">
            {nextModules.map((module, index) => (
              <div
                key={`next-module-${index}`}
                className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg border border-white/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-lg hover:border-white/60 group"
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Module Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors duration-200">
                      {module?.ModuleName || module?.module_name || module}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadMapUI = ({ title, topics, nextModules }) => {
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
    <div className="w-full pb-[130px]">
      {/* Header */}
      <div className="mb-8 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight flex items-center">
            <div className="bg-gradient-to-br from-[#0284c7] to-[#22d3ee] rounded-xl mr-3 shadow-lg">
              <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {title || 'Learning Roadmap'}
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {weekNumber && (
            <div className="flex items-center gap-1 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/50">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Week {weekNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/50">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-700">{sortedTopics.length} Topics</span>
          </div>
        </div>
      </div>

      {/* Current Week Topics */}
      <div>
        <div className="bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6">
            {sortedTopics.map((topic, idx) => (
              <div key={`topic-${topic.topic_order}-${idx}`} className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                {/* Topic Header */}
                <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/60 border-b border-white/30 p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-tight">
                        <span className="bg-gradient-to-r from-[#0284c7] to-[#22d3ee] text-white rounded-lg px-2 py-1 text-sm font-bold mr-2 shadow-md">
                          {topic.topic_order}
                        </span>
                        {topic.topic_name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {topic.duration_to_complete && (
                        <span className="bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md border border-emerald-200/50">
                          <Clock className="w-4 h-4" />
                          {topic.duration_to_complete}
                        </span>
                      )}

                      {topicTypeLabel(topic.topic_type) && (
                        <span className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md border border-blue-200/50">
                          {topicTypeLabel(topic.topic_type)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Topic Content */}
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Why Learn This Topic */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-2 rounded-lg">
                        <BookOpen className="w-4 h-4 text-slate-600" />
                      </div>
                      Why learn this topic:
                    </h4>
                    <div className="bg-gradient-to-r from-slate-50/80 to-white/60 p-4 rounded-xl border border-slate-200/40">
                      <p className="text-slate-700 leading-relaxed">
                        {topic.why_learn_this_topic}
                      </p>
                    </div>
                  </div>

                  {/* Optional video section */}
                  {topic.video_link && (
                    <div>
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="bg-gradient-to-br from-red-100 to-red-200 p-2 rounded-lg">
                          <Play className="w-4 h-4 text-red-600" />
                        </div>
                        Video Tutorial:
                      </h4>
                      <div className="flex justify-center lg:justify-start">
                        <div className="w-full max-w-md">
                          <YouTubeVideoCard
                            url={topic.video_link}
                            title={topic.video_title}
                            onClick={handleVideoClick}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional resources section */}
                  {Array.isArray(topic.resources) && topic.resources.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-lg">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>
                        Resources:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <div>
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-2 rounded-lg">
                          <ExternalLink className="w-4 h-4 text-orange-600" />
                        </div>
                        Assignments:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Modules Section */}
      <NextModulesCard nextModules={nextModules} />
    </div>
  );
};

export default RoadMapUI;