import { createContext, useContext, useState } from 'react';

const LectureHallContext = createContext({
  activePanel: null,
  openPanel: () => {},
  closePanel: () => {},
  registerPause: () => {},
  pauseVideo: () => {}
});

export function LectureHallProvider({ children }) {
  const [activePanel, setActivePanel] = useState(null);
  const [pauseFn, setPauseFn] = useState(() => () => {});

  const openPanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const closePanel = () => setActivePanel(null);

  const registerPause = (fn) => {
    setPauseFn(() => fn);
  };

  const pauseVideo = () => {
    pauseFn();
  };

  return (
    <LectureHallContext.Provider value={{ activePanel, openPanel, closePanel, registerPause, pauseVideo }}>
      {children}
    </LectureHallContext.Provider>
  );
}

export const useLectureHall = () => useContext(LectureHallContext);
