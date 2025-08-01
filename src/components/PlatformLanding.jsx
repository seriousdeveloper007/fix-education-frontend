import React, { useState } from 'react';
import { useAudioRecorder } from './AudioRecorderContext.jsx';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, PlayCircle, Video } from 'lucide-react';
import themeConfig from './themeConfig';

function isValidYouTubeUrl(url) {
  try {
    const u = new URL(url);
    const hosts = ['youtu.be', 'www.youtube.com', 'youtube.com', 'm.youtube.com'];
    if (!hosts.includes(u.hostname)) return false;
    if (u.hostname === 'youtu.be' && u.pathname.length > 1) return true;
    return Boolean(u.searchParams.get('v'));
  } catch {
    return false;
  }
}

export default function PlatformLanding() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cfg = themeConfig.app;
  const { start } = useAudioRecorder();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (isValidYouTubeUrl(trimmed)) {
      setError('');
      console.log('Starting recording');
      start();
      navigate(`/platform/lecturehall?video=${encodeURIComponent(trimmed)}`);
    } else {
      setError('Please enter a valid YouTube URL');
    }
  };

  return (
    <div className={cfg.root}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Welcome Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video size={32} className={cfg.sidebarIcon} />
            <h1 className={`text-3xl font-bold ${cfg.heading}`}>
              Interactive Learning Platform
            </h1>
          </div>
          <p className={`text-lg ${cfg.text} max-w-2xl`}>
            Transform any YouTube video into an interactive learning experience with AI-powered doubt resolution, smart note-taking, and personalized quizzes.
          </p>
        </div>

        {/* Main Input Form */}
        <form
          onSubmit={handleSubmit}
          className={`max-w-xl w-full space-y-6 p-8 rounded-2xl shadow-xl ${cfg.learningCard}`}
        >
          <div className="text-center space-y-2">
            <h2 className={`text-2xl font-semibold ${cfg.heading}`}>
              Start Learning
            </h2>
            <p className={cfg.subtext}>
              Paste a YouTube video link below to begin your interactive learning session
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${cfg.text}`}>
                YouTube Video URL
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
                className={`w-full px-4 py-3 rounded-lg border border-slate-300 bg-white/80 ${cfg.focusRing} transition-all duration-200`}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!url.trim()}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg font-semibold text-lg ${cfg.primaryBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <PlayCircle size={24} /> Start Learning
            </button>
          </div>
        </form>

        {/* Feature Preview */}
        <div className="mt-12 max-w-4xl w-full">
          <h3 className={`text-xl font-semibold text-center mb-6 ${cfg.heading}`}>
            What You Can Do
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg text-center space-y-3 ${cfg.materialCard}`}>
              <div className="flex justify-center">
                <div className={`p-3 rounded-full bg-emerald-100`}>
                  <AlertCircle size={24} className="text-emerald-600" />
                </div>
              </div>
              <h4 className={`font-medium ${cfg.heading}`}>Ask AI Doubts</h4>
              <p className={cfg.subtext}>
                Get instant answers to your questions about the video content from our AI assistant
              </p>
            </div>

            <div className={`p-6 rounded-lg text-center space-y-3 ${cfg.materialCard}`}>
              <div className="flex justify-center">
                <div className={`p-3 rounded-full bg-blue-100`}>
                  <PlayCircle size={24} className="text-blue-600" />
                </div>
              </div>
              <h4 className={`font-medium ${cfg.heading}`}>Smart Notes</h4>
              <p className={cfg.subtext}>
                Take timestamped notes that sync with the video for better retention and review
              </p>
            </div>

            <div className={`p-6 rounded-lg text-center space-y-3 ${cfg.materialCard}`}>
              <div className="flex justify-center">
                <div className={`p-3 rounded-full bg-purple-100`}>
                  <Video size={24} className="text-purple-600" />
                </div>
              </div>
              <h4 className={`font-medium ${cfg.heading}`}>Test Yourself</h4>
              <p className={cfg.subtext}>
                Take AI-generated quizzes based on the video content to test your understanding
              </p>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  );
}
