import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Mic, Square } from 'lucide-react';
import { MessageList } from '../startLearning/MessageList';

const recognitionErrorMap = {
  'no-speech': 'We did not hear anything. Please try again.',
  'audio-capture': 'No microphone was detected. Please check your device.',
  'not-allowed': 'Microphone access was blocked. Allow access and try again.',
  'service-not-allowed': 'Microphone access was blocked. Allow access and try again.',
  network: 'A network error interrupted the transcription. Please retry.',
};

const createWelcomeMessage = (lessonName) => ({
  message_from: 'agent',
  text: lessonName
    ? `Hi! I am ready to discuss "${lessonName}". Tap the microphone below to start speaking.`
    : 'Hi! Tap the microphone below to start speaking.',
});

const RecordingVisualizer = React.memo(function RecordingVisualizer() {
  const waveSizes = [120, 170, 220];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {waveSizes.map((size, index) => (
        <span
          key={size}
          className="absolute rounded-full border-2 border-blue-400/70 animate-ping"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.8s',
          }}
        />
      ))}
    </div>
  );
});

const DiscussionUI = ({ lessonId, lessonName }) => {
  const [messages, setMessages] = useState(() => [createWelcomeMessage(lessonName)]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [error, setError] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechSupported(Boolean(SpeechRecognition));
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      if (
        prev.length === 1 &&
        prev[0].message_from === 'agent'
      ) {
        const updated = createWelcomeMessage(lessonName);
        if (prev[0].text === updated.text) {
          return prev;
        }
        return [updated];
      }
      return prev;
    });
  }, [lessonName]);

  const stopRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      recognition.stop();
    } catch {
      // Recognition might already be stopped.
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!isSpeechSupported) {
      setError('Speech-to-text is not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech-to-text is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setLiveTranscript('');

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';

        if (result.isFinal) {
          finalTranscriptRef.current += transcript;
        } else {
          interim += transcript;
        }
      }

      interimTranscriptRef.current = interim;
      const preview = `${finalTranscriptRef.current}${interim}`.trim();
      setLiveTranscript(preview);
    };

    recognition.onerror = (event) => {
      const message = recognitionErrorMap[event.error] ??
        'Unable to transcribe your audio. Please try again.';
      setError(message);
      setIsRecording(false);
      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setLiveTranscript('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      const finalText = `${finalTranscriptRef.current}${interimTranscriptRef.current}`
        .replace(/\s+/g, ' ')
        .trim();

      if (finalText) {
        setMessages((prev) => [
          ...prev,
          {
            message_from: 'user',
            text: finalText,
          },
        ]);
      }

      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setLiveTranscript('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
      recognitionRef.current = null;
      setError('Unable to start recording. Please try again.');
    }
  }, [isSpeechSupported]);

  useEffect(() => () => {
    stopRecording();
    recognitionRef.current = null;
  }, [stopRecording]);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return (
    <div
      className="flex-1 min-h-0 w-full flex flex-col"
      data-lesson-id={lessonId}
    >
      <div className="flex-1 min-h-0">
        <MessageList messages={messages} isLoading={false} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 pb-6 pt-4">
        <div className="relative flex items-center justify-center">
          {isRecording && <RecordingVisualizer />}

          <button
            type="button"
            onClick={handleToggleRecording}
            className={`relative z-10 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60 ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
            disabled={!isSpeechSupported && !isRecording}
            aria-pressed={isRecording}
          >
            {isRecording ? (
              <>
                <Square className="h-5 w-5" />
                Stop recording
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Speak
              </>
            )}
          </button>
        </div>

        {isRecording && (
          <div className="text-center text-xs text-blue-600">
            <div className="font-semibold">Listening...</div>
            {liveTranscript && (
              <div className="mt-1 max-w-xs text-[0.7rem] text-blue-700/80">
                {liveTranscript}
              </div>
            )}
          </div>
        )}

        {!isSpeechSupported && (
          <p className="max-w-xs text-center text-xs text-gray-500">
            Speech-to-text is not supported in this browser.
          </p>
        )}

        {error && (
          <p className="max-w-xs text-center text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default DiscussionUI;

DiscussionUI.propTypes = {
  lessonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lessonName: PropTypes.string,
};
