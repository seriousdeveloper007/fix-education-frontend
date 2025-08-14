/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Loader2, Youtube } from 'lucide-react';
import analytics from '../services/posthogService';
import { createTab } from '../services/tabService';


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


export default function VideoLinkInputCard({ cfg, initialUrl = '' }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  const handleClick = async () => {
    setError('');
    setLoading(true);
    const trimmed = url.trim();
    if (!isValidYouTubeUrl(trimmed)) {
      setError('Please enter a valid YouTube URL');
      setLoading(false);
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      if (!user || !token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      const tab = await createTab(user.id, trimmed, token);
      localStorage.setItem('tabId', tab.id);
      localStorage.removeItem('chatId');
      analytics.youtubeLearningStarted(trimmed);
      navigate(`/study-room?video=${encodeURIComponent(trimmed)}&mode=play`);
    } catch (err) {
      console.error(err);
      setError('Failed to initiate learning session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div id="videolink-input-card" className={`w-full max-w-[600px] ${cfg.card} min-h-[250px]`}>
      <div className={`${cfg.cardHeadinglarge} flex items-center gap-2`}>
        <Youtube size={48} />
        Enter YouTube Video URL
      </div>
      <div className={cfg.cardSubheading}>
      ILON AI clears the doubts, tickles your brain with quizzes, and lines up your notes like a pro librarian on caffeine.
      </div>
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=..."
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError('');
        }}
        className={cfg.inputfield}
      />
      <button
        onClick={handleClick}
        disabled={!url.trim() || loading}
        className={`${cfg.primaryButton} mx-auto`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" /> Preparing Study Room...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <PlayCircle size={24} /> Start Learning
          </div>
        )}
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}