import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HelpCircle, PencilLine, ClipboardList, ArrowLeft } from 'lucide-react';
import themeConfig from './themeConfig';
import { useAudioRecorder } from './AudioRecorderContext.jsx';

function extractId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1);
    }
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

export default function LectureHall({ theme }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const videoUrl = params.get('video');
  const videoId = extractId(videoUrl);
  const cfg = themeConfig[theme];
  const { stop } = useAudioRecorder();

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleBack = () => {
    navigate('/workspace');
  };

  return (
    <div className="p-6">
      <button
        onClick={handleBack}
        className={`flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${cfg.secondaryBtn}`}
      >
        <ArrowLeft size={18} /> Back
      </button>
      {videoId ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex justify-center gap-4">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.primaryBtn}`}>
              <HelpCircle size={18} /> Ask Doubt
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.secondaryBtn}`}>
              <PencilLine size={18} /> Write Notes
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-full ${cfg.secondaryBtn}`}>
              <ClipboardList size={18} /> Test Yourself
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No video selected.</p>
      )}
    </div>
  );
}
