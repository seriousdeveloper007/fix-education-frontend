import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import {
  SiPython,
  SiJavascript,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiFastapi,
  SiPytorch,
  SiTensorflow,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSqlite,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
} from "react-icons/si";
import MarkdownRenderer from "./MarkdownRenderer";
import { useRoadmapWebSocket } from "../services/RoadmapWebSocket";
import { fetchRoadmapMessages } from "../services/roadmapMessageService";
import RoadMapUI from '../components/RoadMapUI';
import { deleteRoadmap, fetchRoadmapById, assignRoadmapToUser, fetchUserRoadmaps } from '../services/roadmapService';
import BasicNavbar from './BasicNavbar';
import PlatformNavbar from './PlatformNavbar';

const ROTATING_PROMPTS = [
  "I am a complete beginner and want to get into backend engineering",
  "I know JavaScript but want to learn backend with Node.js",
  "I'm a beginner and want to create AI Agents",
  "I have solid SQL skills and want to move into Product Management",
  "I'm comfortable with data analysis and want to learn MLOps",
];
const BG_ICONS = [
  { C: SiPython, color: "#3776AB", size: 48, top: "8%", left: "6%" },
  { C: SiJavascript, color: "#F7DF1E", size: 44, top: "16%", left: "32%" },
  { C: SiReact, color: "#61DAFB", size: 46, top: "6%", left: "72%" },
  { C: SiNodedotjs, color: "#3C873A", size: 42, top: "28%", left: "85%" },
  { C: SiTailwindcss, color: "#38BDF8", size: 40, top: "22%", left: "12%" },
  { C: SiFastapi, color: "#05998B", size: 44, top: "34%", left: "40%" },
  { C: SiPytorch, color: "#EE4C2C", size: 46, top: "18%", left: "58%" },
  { C: SiTensorflow, color: "#FF6F00", size: 44, top: "40%", left: "68%" },
  { C: SiPostgresql, color: "#336791", size: 46, top: "52%", left: "10%" },
  { C: SiMongodb, color: "#47A248", size: 42, top: "62%", left: "30%" },
  { C: SiMysql, color: "#005E86", size: 44, top: "72%", left: "55%" },
  { C: SiSqlite, color: "#003B57", size: 42, top: "80%", left: "78%" },
  { C: SiDocker, color: "#2496ED", size: 46, top: "58%", left: "84%" },
  { C: SiKubernetes, color: "#326CE5", size: 44, top: "74%", left: "16%" },
  { C: SiGit, color: "#F05032", size: 40, top: "86%", left: "38%" },
  { C: SiGithub, color: "#24292E", size: 40, top: "88%", left: "64%" },
];

function useAutoScroll(ref, deps) {
  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }

  }, deps);
}

function useTypewriter(prompts, paused) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [mode, setMode] = useState("typing");

  const typed = prompts[promptIdx].slice(0, charIdx);

  useEffect(() => {
    if (paused) return;

    const current = prompts[promptIdx];

    if (mode === "typing") {
      if (charIdx < current.length) {
        const t = setTimeout(() => setCharIdx((c) => c + 1), 38);
        return () => clearTimeout(t);
      }
      setMode("pausing");
      const t = setTimeout(() => setMode("deleting"), 1200);
      return () => clearTimeout(t);
    }

    if (mode === "deleting") {
      if (charIdx > 0) {
        const t = setTimeout(() => setCharIdx((c) => c - 1), 22);
        return () => clearTimeout(t);
      }
      setMode("typing");
      setPromptIdx((i) => (i + 1) % prompts.length);
    }

    if (mode === "pausing") {
      const t = setTimeout(() => setMode("deleting"), 800);
      return () => clearTimeout(t);
    }
  }, [paused, prompts, promptIdx, charIdx, mode]);

  return typed;
}


const LoadingDots = React.memo(function LoadingDots() {
  return (
    <div className="mr-auto w-fit max-w-full bg-gray-100 px-3 py-2 rounded-xl text-sm">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
});

const BackgroundIconCloud = React.memo(function BackgroundIconCloud({ icons }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {icons.map(({ C, color, size, top, left }, i) => (
        <div
          key={i}
          className="absolute opacity-20 hover:opacity-40 transition-opacity duration-300 sm:scale-100 scale-75"
          style={{ top, left }}
        >
          <C size={size} style={{ color }} />
        </div>
      ))}
    </div>
  );
});

const MessageList = React.memo(function MessageList({ messages, isLoading, containerRef }) {
  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto space-y-3 mt-2 scrollbar-hide pb-4">
      {messages.map((msg, idx) => {
        if (msg.type === "roadmap") {
          return (
            <div key={idx} className="mr-auto w-full">
              <RoadMapUI roadmapData={msg.roadmap} />
            </div>
          );
        }

        return (
          <div
            key={idx}
            className={`${msg.role === "user"
                ? "ml-auto w-fit max-w-[75%] bg-blue-100"
                : "mr-auto w-fit max-w-full bg-gray-100"
              } px-3 py-2 rounded-xl text-sm break-words`}
          >
            <MarkdownRenderer text={msg.text} />
          </div>
        );
      })}
      {isLoading && <LoadingDots />}
    </div>
  );
});


const Hero = React.memo(function Hero({ input, setInput, typed, onSend, onReset, onFocus, onBlur, isLoading }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start pt-16">
        <div className="w-full">
        {isLoggedIn() ? (
          <PlatformNavbar defaultTab="Roadmap" />
        ) : (
          <BasicNavbar />
        )}
      </div>
      
      <div className="max-w-4xl px-1 text-center">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mx-2">
          Achieve your goal by building your{" "}
          <span className="relative inline-block px-1 py-1 sm:py-2">
            <span className="absolute inset-x-0 bottom-0 h-3 bg-emerald-200/60 rounded-lg -z-10" />
            <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Personalized Roadmap
            </span>
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-4xl mx-auto">
          ILON AI curates the best free resources from YouTube, GitHub, LeetCode, HackerRank, and more — matched to your skill level.
        </p>
      </div>

      <div className="mt-12 w-full max-w-4xl px-1">
        <div className="border rounded-xl flex items-start px-2 py-1 shadow-sm bg-white/70 backdrop-blur-md">
          <div className="relative flex-1">
            {input.length === 0 && (
              <div className="pointer-events-none absolute left-3 top-2.5 right-2 text-sm text-slate-400/90">
                {typed}
                <span className="inline-block w-2 animate-pulse">|</span>
              </div>
            )}
            <textarea
              rows={4}
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder=""
              className="w-full resize-none px-3 py-2 text-sm focus:outline-none focus:ring-0 border-none scrollbar-hide bg-transparent"
              style={{ maxHeight: "120px", minHeight: "40px", overflowY: "auto" }}
            />
          </div>

          <div className="ml-2 flex flex-col items-center space-y-2">
            <button
              onClick={onSend}
              className="p-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white h-[40px] w-[40px] flex items-center justify-center transition-all"
              title="Send"
            >
              <ArrowRight size={20} />
            </button>
            <span
              onClick={onReset}
              className="text-xs font-medium bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent hover:underline cursor-pointer"
            >
              + Start Again
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

const Composer = React.memo(function Composer({
  value,
  onChange,
  onSend,
  onReset,
  onFocus,
  onBlur,
  isLoading,
  placeholder = "Type your goal or current skills…",
  rows = 4,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
<>
    <div className="w-full">
      {isLoggedIn() ? (
        <PlatformNavbar defaultTab="Roadmap" />
      ) : (
        <BasicNavbar />
      )}
    </div>
    <div className="flex-shrink-0 pt-2 pr-2 border rounded-xl flex items-start bg-white/80 backdrop-blur-md mb-4">
      <textarea
        rows={rows}
        value={value}
        disabled={isLoading}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="flex-1 resize-none px-3 py-1 text-sm focus:outline-none focus:ring-0 border-none scrollbar-hide bg-transparent"
        style={{ maxHeight: "120px", minHeight: "40px", overflowY: "auto" }}
      />
      <div className="ml-2 flex flex-col items-center space-y-2">
        <button
          onClick={onSend}
          className="p-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white h-[40px] w-[40px] flex items-center justify-center transition-all"
          title="Send"
        >
          <ArrowRight size={20} />
        </button>
        <span
          onClick={() => {
            onReset?.();
          }}
          className="text-xs font-medium bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent hover:underline cursor-pointer"
        >
          + Start Again
        </span>
      </div>
    </div>
    </>
  );
});

function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

export default function ChatRoadmap() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingRoadmap, setExistingRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [chatDisabled, setChatDisabled] = useState(false);

  const hasConnectedRef = useRef(false);

  const getAuthData = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          return { token, user };
        }
      }
    } catch (error) {
      console.error('Error getting auth data:', error);
    }
    return null;
  }, []);
  const assignRoadmapToCurrentUser = useCallback(async (roadmapId) => {
    const authData = getAuthData();
    if (!authData || !roadmapId) return false;

    try {
      await assignRoadmapToUser(roadmapId, authData.user.id, authData.token);
      console.log('Roadmap assigned to user successfully');
      return true;
    } catch (error) {
      console.error('Failed to assign roadmap to user:', error);
      return false;
    }
  }, [getAuthData]);

  const { sendMessage, connect, close } = useRoadmapWebSocket({
    onMessage: async (msg) => {
      setIsLoading(false);
      if (typeof msg === "object" && msg && msg.roadmap_id && msg.roadmap) {
        localStorage.setItem('roadmapId', msg.roadmap_id);

        const authData = getAuthData();
        if (authData) {
          console.log('User is logged in, assigning roadmap...');
          setTimeout(async () => {
            try {
              await assignRoadmapToCurrentUser(msg.roadmap_id);
            } catch (error) {
              console.error('Failed to assign roadmap immediately after creation:', error);
              setTimeout(() => {
                assignRoadmapToCurrentUser(msg.roadmap_id);
              }, 2000);
            }
          }, 500);
        }

        setChatDisabled(true);

        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            type: "roadmap",
            roadmap: msg.roadmap,
          }
        ]);
        return;
      }

      if (typeof msg === "object" && msg !== null) {
        setMessages((prev) => [
          ...prev,
          { role: "agent", text: msg.message ?? JSON.stringify(msg) }
        ]);

        setTimeout(() => {
          setIsLoading(true);
        }, 1000);

        return;
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (!last || last.role === "user") {
          return [...prev, { role: "agent", text: msg }];
        } else {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            text: (last.text || "") + msg,
          };
          return updated;
        }
      });
    }

  });

  const messageContainerRef = useRef(null);
  useAutoScroll(messageContainerRef, [messages, isLoading]);

  const typed = useTypewriter(ROTATING_PROMPTS, isFocused || input.length > 0);

  useEffect(() => {
    const chatRoadmapId = localStorage.getItem('chatRoadmapId');
    if (!chatRoadmapId) return;
    fetchRoadmapMessages(chatRoadmapId)
      .then((loaded) => setMessages(loaded))
      .catch((err) => {
        console.error('Failed to load messages', err);
      });
  }, []);

  useEffect(() => {
    const checkForExistingRoadmap = async () => {
      const roadmapId = localStorage.getItem('roadmapId');
      const authData = getAuthData();

      if (roadmapId) {
        setRoadmapLoading(true);
        try {
          const roadmapData = await fetchRoadmapById(roadmapId, authData?.token);

          if (roadmapData) {
            setExistingRoadmap(roadmapData);
            setChatDisabled(true);
            setMessages([]);
          } else {
            localStorage.removeItem('roadmapId');
          }
        } catch (error) {
          console.error('Error checking for existing roadmap:', error);
        } finally {
          setRoadmapLoading(false);
        }
      }


      else if (authData && authData.user?.id) {
        setRoadmapLoading(true);
        try {
          const existingRoadmap = await fetchUserRoadmaps(authData.user.id, authData.token);
          if (existingRoadmap) {
            console.log('Found existing roadmap for logged in user');
            localStorage.setItem('roadmapId', existingRoadmap.id.toString());
            setExistingRoadmap(existingRoadmap);
            setChatDisabled(true);
            setMessages([]);
          }
        } catch (error) {
          console.error('Error fetching user roadmaps:', error);
        } finally {
          setRoadmapLoading(false);
        }
      }

    }
    checkForExistingRoadmap();
  }, [getAuthData]);

  useEffect(() => {
    const handleUserLogin = async (event) => {
      const { user, token } = event.detail;
      const roadmapId = localStorage.getItem('roadmapId');

      if (roadmapId) {
        console.log('User logged in with existing roadmap, assigning...');
        try {
          await assignRoadmapToUser(roadmapId, user.id, token);
          console.log('Roadmap assigned after login');
        } catch (error) {
          console.error('Failed to assign roadmap after login:', error);
        }
      }

      else {
        console.log('Checking for user existing roadmaps after login...');
        try {
          const existingRoadmap = await fetchUserRoadmaps(user.id, token);
          if (existingRoadmap) {
            console.log('Found existing roadmap after login:', existingRoadmap.id);
            localStorage.setItem('roadmapId', existingRoadmap.id.toString());
            setExistingRoadmap(existingRoadmap);
            setChatDisabled(true);
            setMessages([]);
          }
        } catch (error) {
          console.error('Failed to fetch user roadmaps after login:', error);
        }
      }
    };


    window.addEventListener('userLoggedIn', handleUserLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  const hasMessages = messages.length > 0;

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsLoading(true);

    const authData = getAuthData();

    const payload = { text: trimmed, message_type: 'text', ...(authData && { user_id: authData.user.id, auth_token: authData.token }) };

    if (!hasConnectedRef.current) {
      connect();
      hasConnectedRef.current = true;

      setTimeout(() => {
        sendMessage(payload);
      }, 3000);
    } else {
      sendMessage(payload);
    }
  }, [input, connect, sendMessage, getAuthData]);

  const resetChat = useCallback(async () => {

    const authData = getAuthData();
    const roadmapId = localStorage.getItem('roadmapId');

    if (authData && roadmapId) {
      try {
        await deleteRoadmap(roadmapId, authData.token);
        console.log('Roadmap deleted successfully');
      } catch (error) {
        console.error('Failed to delete roadmap:', error);
      }
    }

    setMessages([]);
    setInput('');
    setIsLoading(false);
    setExistingRoadmap(null);
    setChatDisabled(false);
    hasConnectedRef.current = false;
    localStorage.removeItem("chatRoadmapId");
    localStorage.removeItem("roadmapId");
    close();
  }, [close, getAuthData]);

  const icons = useMemo(() => BG_ICONS, []);

  return (
    <>
      
      
    <div className="relative w-full overflow-hidden min-h-screen text-slate-900 selection:bg-emerald-300/30 font-fraunces bg-white">
    
      <BackgroundIconCloud icons={icons} />

      {roadmapLoading && (
        <div className="relative z-10 h-screen w-full flex items-center justify-center">
          <LoadingDots />
        </div>
      )}

      {!roadmapLoading && existingRoadmap && (
        <div className="relative z-10 h-screen w-full flex flex-col pt-4">
          <div className="w-full max-w-4xl mx-auto px-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-3 mt-2 scrollbar-hide pb-4">
              <div className="mr-auto w-full">
                <RoadMapUI roadmapData={existingRoadmap} />
              </div>
            </div>

            <div className="flex-shrink-0 pt-2 pr-2 mb-4 flex justify-center">
              <button
                onClick={resetChat}
                className="px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white rounded-lg transition-all text-sm"
              >
                Create New Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {!roadmapLoading && !existingRoadmap && (
        <>
          {!hasMessages ? (
            <Hero
              input={input}
              setInput={setInput}
              typed={typed}
              onSend={handleSend}
              onReset={resetChat}
              isLoading={isLoading}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          ) : (
            <div className="relative z-10 h-screen w-full flex flex-col pt-4">
              <div className="w-full max-w-4xl mx-auto px-1 flex flex-col h-full">
                <MessageList messages={messages} isLoading={isLoading} containerRef={messageContainerRef} />

               
                {!chatDisabled && (
                  <Composer
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onReset={resetChat}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    isLoading={isLoading}
                    placeholder="Type your goal or current skills…"
                    rows={4}
                  />
                )}
                {chatDisabled && !existingRoadmap && (
                  <div className="flex-shrink-0 pt-2 pr-2 mb-4 flex justify-center">
                    <button
                      onClick={resetChat}
                      className="px-4 py-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#22d3ee] hover:from-[#0369a1] hover:to-[#06b6d4] text-white rounded-lg transition-all text-sm"
                    >
                      Create New Roadmap
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}