import React, { createContext, useContext, useRef, useState } from 'react';

const RecordingContext = createContext({
  isRecording: false,
  chunks: [],
  transcript: null,
  start: () => {},
  stop: () => {}
});

const RECORDING_ICON =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="%23ff0000"/></svg>';
const DEFAULT_ICON = '/vite.svg';

function setFavicon(recording) {
  const link = document.querySelector("link[rel='icon']");
  if (link) {
    link.href = recording ? RECORDING_ICON : DEFAULT_ICON;
  }
}

export function AudioRecorderProvider({ children }) {
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const mediaRecorderRef = useRef(null);

  const start = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: true,
      });
      const audioStream = new MediaStream(stream.getAudioTracks());
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          console.log('Captured chunk', e.data);
          setChunks((prev) => [...prev, e.data]);
        }
      };
      mediaRecorderRef.current.start(10000);
      setIsRecording(true);
      setFavicon(true);
    } catch (err) {
      console.error('Unable to start audio recording', err);
    }
  };

  async function processChunks() {
    console.log('Processing recorded chunks', chunks);
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: 'audio/webm' });
    // Placeholder transcription implementation
    const text = '[Transcription unavailable in demo]';
    console.log('Generated transcript:', text);
    setTranscript(text);
    window.currentTranscript = text;
  }

  const stop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
    setFavicon(false);
    if (!transcript) {
      processChunks();
    }
  };

  return (
    <RecordingContext.Provider value={{ isRecording, chunks, transcript, setTranscript, start, stop }}>
      {children}
    </RecordingContext.Provider>
  );
}

export const useAudioRecorder = () => useContext(RecordingContext);
