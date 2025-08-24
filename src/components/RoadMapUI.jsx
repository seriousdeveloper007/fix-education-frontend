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
import themeConfig from '../components/themeConfig';

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
    // In a real app, you'd fetch this from your backend
    // For now, we'll extract domain and create a simple title
    const extractMetadata = () => {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        const path = urlObj.pathname;

        // Simple title generation based on domain and path
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

// YouTube video component
const YouTubeVideoCard = ({ url, title, onClick }) => {
  const [videoTitle, setVideoTitle] = useState(title || 'YouTube Video');
  const thumbnailUrl = getYouTubeThumbnail(url);

  useEffect(() => {
    // In a real app, you'd fetch the actual video title from YouTube API
    // For now, we'll use the provided title or generate one
    if (!title) {
      const videoId = getYouTubeVideoId(url);
      if (videoId) {
        setVideoTitle(`Video: ${videoId}`);
      }
    }
  }, [url, title]);

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
  // Updated sample data with scenarios where some fields are missing
  const sampleData = {
    id: "rm_001",
    title: "YouTube Search Roadmap for Reinforcement Learning (15–20 min Videos)",
    user_id: "user_123",
    topics: [
      // Week 1 - Complete data
      {
        id: "t_001",
        name: "PyTorch basics tutorial",
        description: "Learn the fundamentals of PyTorch including tensors, autograd, and basic neural network operations. This tutorial covers essential concepts needed for deep learning.",
        duration: "3-4 hours",
        resources: [
          "https://pytorch.org/tutorials/beginner/basics/intro.html",
          "https://towardsdatascience.com/pytorch-tutorial-for-beginners-8331afc552c4",
          "https://github.com/pytorch/tutorials",
          "https://pytorch.org/docs/stable/index.html",
          "https://paperswithcode.com/lib/pytorch"
        ],
        video_link: "https://youtube.com/watch?v=c36lUUr864M",
        video_title: "PyTorch Tutorial - PyTorch in 100 Seconds",
        roadmap_id: "rm_001",
        week_number: 1,
        topic_order: 1
      },
      {
        id: "t_002",
        name: "Build neural network from scratch PyTorch short tutorial",
        description: "Hands-on implementation of a neural network from scratch using PyTorch. Learn to create layers, define forward pass, and implement backpropagation.",
        duration: "4-5 hours",
        resources: [
          "https://pytorch.org/tutorials/beginner/pytorch_with_examples.html",
          "https://blog.paperspace.com/pytorch-101-building-neural-networks/",
          "https://github.com/pytorch/examples",
          "https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html",
          "https://machinelearningmastery.com/develop-your-first-neural-network-in-pytorch-step-by-step/"
        ],
        video_link: "https://youtube.com/watch?v=BzcBsTou0C0",
        video_title: "Neural Networks from Scratch in PyTorch",
        roadmap_id: "rm_001",
        week_number: 1,
        topic_order: 2
      },
      
      // Week 2 - Missing some fields
      {
        id: "t_003",
        name: "Introduction to Reinforcement Learning concepts",
        description: "Understand basic RL concepts including agents, environments, rewards, and the Markov Decision Process. Foundation for advanced RL algorithms.",
        // duration missing
        resources: [
          "https://spinningup.openai.com/en/latest/spinningup/rl_intro.html",
          "https://towardsdatascience.com/reinforcement-learning-101-e24b50e1d292",
          "https://github.com/openai/gym"
        ],
        video_link: "https://youtube.com/watch?v=JgvyzIkgxF0",
        // video_title missing
        roadmap_id: "rm_001",
        week_number: 2,
        topic_order: 1
      },
      {
        id: "t_004",
        name: "Q-Learning Algorithm Fundamentals",
        description: "Deep dive into Q-Learning algorithm, understanding the Q-function, exploration vs exploitation, and implementing basic Q-learning from scratch.",
        duration: "2-3 hours",
        // resources missing
        video_link: "https://youtube.com/watch?v=qhRNvCVVJaA",
        video_title: "Q-Learning Explained - Reinforcement Learning",
        roadmap_id: "rm_001",
        week_number: 2,
        topic_order: 2
      },

      // Week 3 - Minimal data (only required fields)
      {
        id: "t_005",
        name: "Deep Q-Networks (DQN) Implementation",
        description: "Learn to implement Deep Q-Networks combining Q-Learning with neural networks. Understand experience replay and target networks.",
        // duration missing
        // resources missing
        // video_link missing
        // video_title missing
        roadmap_id: "rm_001",
        week_number: 3,
        topic_order: 1
      },
      {
        id: "t_006",
        name: "Policy Gradient Methods",
        description: "Introduction to policy gradient methods including REINFORCE algorithm. Learn how to directly optimize policy parameters for continuous action spaces.",
        // duration missing
        resources: [
          "https://spinningup.openai.com/en/latest/algorithms/vpg.html",
          "https://towardsdatascience.com/policy-gradient-methods-104c783251e0"
        ],
        // video_link missing
        // video_title missing
        roadmap_id: "rm_001",
        week_number: 3,
        topic_order: 2
      },
      {
        id: "t_007",
        name: "Actor-Critic Methods",
        description: "Combine value-based and policy-based methods with Actor-Critic architecture. Understand advantage functions and variance reduction techniques.",
        duration: "3-4 hours",
        // resources missing
        // video_link missing
        // video_title missing
        roadmap_id: "rm_001",
        week_number: 3,
        topic_order: 3
      }
    ]
  };

  // Use provided data or fallback to sample data
  const data = roadmapData || sampleData;

  // Group topics by week
  const topicsByWeek = data.topics.reduce((acc, topic) => {
    const week = topic.week_number;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(topic);
    return acc;
  }, {});

  // Sort topics within each week by topic_order
  Object.keys(topicsByWeek).forEach(week => {
    topicsByWeek[week].sort((a, b) => a.topic_order - b.topic_order);
  });

  const handleVideoClick = (videoLink, topicName) => {
    if (!videoLink) return;
    // This would redirect to ILON AI's interactive video player
    console.log(`Opening video: ${videoLink} for topic: ${topicName}`);
    window.open(videoLink, '_blank');
    // window.open(`/video-player?url=${encodeURIComponent(videoLink)}&title=${encodeURIComponent(topicName)}`, '_blank');
  };

  const handleResourceClick = (resourceLink) => {
    window.open(resourceLink, '_blank');
  };

  return (
    <div className={themeConfig.roadmap.container}>
      {/* Header */}
      <div className={themeConfig.roadmap.header}>
        <div className={themeConfig.roadmap.titleContainer}>
          <h1 className={themeConfig.roadmap.title}>
            <Target className={themeConfig.roadmap.titleIcon} />
            {data.title}
          </h1>
        </div>
        <div className={themeConfig.roadmap.statsText}>
          <Calendar className="w-4 h-4 inline mr-1" />
          Total Weeks: {Math.max(...data.topics.map(t => t.week_number))} |
          <BookOpen className="w-4 h-4 inline ml-2 mr-1" />
          Total Topics: {data.topics.length}
        </div>
      </div>

      {/* Roadmap Content */}
      <div className={themeConfig.roadmap.weekContainer}>
        {Object.keys(topicsByWeek)
          .sort((a, b) => a - b)
          .map(week => (
            <div key={week} className={themeConfig.roadmap.weekCard}>
              <h2 className={themeConfig.roadmap.weekHeader}>
                <span className={themeConfig.roadmap.weekBadge}>
                  {week}
                </span>
                Week {week}
              </h2>

              <div className={themeConfig.roadmap.topicContainer}>
                {topicsByWeek[week].map(topic => (
                  <div key={topic.id} className={themeConfig.roadmap.topicCard}>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className={themeConfig.roadmap.topicTitle}>
                          Topic {topic.topic_order}: {topic.name}
                        </h3>
                      </div>
                      {/* Conditional rendering for duration */}
                      {topic.duration && (
                        <div className="flex-shrink-0">
                          <span className={themeConfig.roadmap.durationBadge}>
                            <Clock className="w-4 h-4" />
                            {topic.duration}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className={themeConfig.roadmap.sectionTitle}>
                        <BookOpen className="w-4 h-4" />
                        Description:
                      </h4>
                      <p className={themeConfig.roadmap.description}>{topic.description}</p>
                    </div>

                    {/* Conditional rendering for video section */}
                    {topic.video_link && (
                      <div className="mb-6">
                        <h4 className={themeConfig.roadmap.sectionTitle}>
                          <Play className="w-4 h-4" />
                          Video Tutorial:
                        </h4>
                        <div className="w-full max-w-none">
                          <YouTubeVideoCard
                            url={topic.video_link}
                            title={topic.video_title} // This can be undefined
                            onClick={handleVideoClick}
                          />
                        </div>
                      </div>
                    )}

                    {/* Conditional rendering for resources section */}
                    {topic.resources && topic.resources.length > 0 && (
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