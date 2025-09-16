import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Mic, Send, Square } from 'lucide-react';
import { MessageList } from '../startLearning/MessageList';
import { useMiniLessonDiscussion } from '../../hooks/useMiniLessonDiscussion';

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
  const {
    messages: discussionMessages,
    isAwaitingResponse,
    isConnecting,
    isLoadingHistory,
    sendMessage,
  } = useMiniLessonDiscussion({ miniLessonId: lessonId });
  
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [error, setError] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const shouldContinueRef = useRef(false);
  const isManualStopRef = useRef(false);

  const fallbackMessage = useMemo(
    () => createWelcomeMessage(lessonName),
    [lessonName],
  );
  
  const displayedMessages = useMemo(
    () => (discussionMessages.length > 0 ? discussionMessages : [fallbackMessage]),
    [discussionMessages, fallbackMessage],
  );
  
  const isBusy = isAwaitingResponse || isConnecting || isLoadingHistory;
  const isMessageListLoading = isBusy;
  const isMicrophoneDisabled = (!isSpeechSupported && !isRecording) || (isBusy && !isRecording);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechSupported(Boolean(SpeechRecognition));
  }, []);

  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Enable continuous recognition

    recognition.onstart = () => {
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';

        if (result.isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      interimTranscriptRef.current = interim;
      const preview = `${finalTranscriptRef.current}${interim}`.trim();
      setLiveTranscript(preview);
    };

    recognition.onerror = (event) => {
      // Ignore 'no-speech' error and continue recording
      if (event.error === 'no-speech') {
        // Don't restart automatically, just continue listening
        return;
      }

      // For other errors, show message but keep recording state if not manually stopped
      const message = recognitionErrorMap[event.error] ??
        'Unable to transcribe your audio. Please try again.';
      setError(message);
      
      // Only stop recording for critical errors
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
        isManualStopRef.current = true;
        shouldContinueRef.current = false;
        setIsRecording(false);
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setLiveTranscript('');
      }
    };

    recognition.onend = () => {
      // If we should continue and it wasn't manually stopped, restart
      if (shouldContinueRef.current && !isManualStopRef.current) {
        setTimeout(() => {
          if (shouldContinueRef.current && !isManualStopRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (err) {
              // Recognition might already be started or stopped
            }
          }
        }, 100);
      } else {
        // Only set recording to false if manually stopped
        if (isManualStopRef.current) {
          setIsRecording(false);
          recognitionRef.current = null;
          setLiveTranscript('');
        }
      }
    };

    return recognition;
  }, []);

  const stopRecording = useCallback(() => {
    isManualStopRef.current = true;
    shouldContinueRef.current = false;
    
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      recognition.stop();
    } catch {
      // Recognition might already be stopped.
    }
    
    setIsRecording(false);
    recognitionRef.current = null;
    setLiveTranscript('');
  }, []);

  const startRecording = useCallback(() => {
    if (!isSpeechSupported) {
      setError('Speech-to-text is not supported in this browser.');
      return;
    }

    // Reset flags and transcripts
    isManualStopRef.current = false;
    shouldContinueRef.current = true;
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setLiveTranscript('');

    const recognition = createRecognition();
    if (!recognition) {
      setError('Unable to initialize speech recognition.');
      return;
    }

    recognitionRef.current = recognition;
    setIsRecording(true);

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
      recognitionRef.current = null;
      shouldContinueRef.current = false;
      setError('Unable to start recording. Please try again.');
    }
  }, [isSpeechSupported, createRecognition]);

  useEffect(() => () => {
    isManualStopRef.current = true;
    shouldContinueRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might already be stopped
      }
    }
    recognitionRef.current = null;
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const handleSendMessage = useCallback(async () => {
    const textToSend = `${finalTranscriptRef.current}${interimTranscriptRef.current}`
      .replace(/\s+/g, ' ')
      .trim();

    if (textToSend) {
      setError(null);
      try {
        const success = await sendMessage(textToSend);
        if (!success) {
          setError('Unable to send your message. Please try again.');
        }
      } catch {
        setError('Unable to send your message. Please try again.');
      }
    }

    // Stop recording and clear everything
    stopRecording();
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
  }, [sendMessage, stopRecording]);

  const handleCancelRecording = useCallback(() => {
    // Stop recording and clear everything
    stopRecording();
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
  }, [stopRecording]);

  return (
    <div
      className="flex flex-col h-full w-full relative"
      data-lesson-id={lessonId}
    >
      {/* Messages area - takes remaining space above fixed controls */}
      <div className="flex-1 overflow-hidden pb-32">
        <MessageList messages={displayedMessages} isLoading={isMessageListLoading} />
      </div>

      {/* Fixed bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          {!isRecording ? (
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                onClick={handleToggleRecording}
                className="relative z-10 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60 bg-blue-600 text-white hover:bg-blue-500"
                disabled={isMicrophoneDisabled}
              >
                <Mic className="h-5 w-5" />
                Speak
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md flex flex-col gap-3">
              <div className="relative flex items-center justify-center">
                <RecordingVisualizer />
              </div>
              
              {liveTranscript && (
                <div className="text-center">
                  <div className="text-xs font-semibold text-blue-600 mb-1">Listening...</div>
                  <div className="max-w-xs mx-auto text-xs text-blue-700/80 bg-blue-50 rounded-lg p-2">
                    {liveTranscript}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!liveTranscript.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
                
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                >
                  <Square className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isSpeechSupported && (
            <p className="max-w-xs text-center text-xs text-gray-500">
              Speech-to-text is not supported in this browser.
            </p>
          )}

          {error && !isRecording && (
            <p className="max-w-xs text-center text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionUI;

DiscussionUI.propTypes = {
  lessonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lessonName: PropTypes.string,
};