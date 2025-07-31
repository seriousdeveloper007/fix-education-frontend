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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
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

  const stop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
    setFavicon(false);
  };

  return (
    <RecordingContext.Provider value={{ isRecording, chunks, transcript, setTranscript, start, stop }}>
      {children}
    </RecordingContext.Provider>
  );
}

export const useAudioRecorder = () => useContext(RecordingContext);
