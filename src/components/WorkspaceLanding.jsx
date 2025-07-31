import React, { useState } from 'react';
import { useAudioRecorder } from './AudioRecorderContext.jsx';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, PlayCircle } from 'lucide-react';
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

export default function WorkspaceLanding({ theme }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cfg = themeConfig[theme];
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
    <>
      <div className="flex justify-center mt-20 px-4">
        <form
          onSubmit={handleSubmit}
          className={`max-w-xl w-full space-y-4 p-6 rounded-3xl shadow-lg backdrop-blur-xl ${cfg.cardBg}`}
        >
          <h2 className="text-2xl font-semibold text-center">Paste a YouTube link</h2>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-lg focus:outline-none bg-transparent border border-slate-300 dark:border-white/20"
          />
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={16} /> {error}
            </p>
          )}
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold ${cfg.primaryBtn}`}
          >
            <PlayCircle size={20} /> Enter
          </button>
        </form>
      </div>
      <p className={`mt-4 text-center ${cfg.text}`}>Welcome to your platform page!</p>
    </>
  );
}
