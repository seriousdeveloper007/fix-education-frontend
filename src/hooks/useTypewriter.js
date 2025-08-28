import { useEffect, useMemo, useRef, useState } from 'react';

export function useTypewriter({
  prompts = ['Type here…'],
  typeMs = 60,
  deleteMs = 35,
  holdMs = 1200,
  paused = false,
}) {
  const list = useMemo(
    () => (Array.isArray(prompts) && prompts.length ? prompts : ['Type here…']),
    [prompts]
  );

  const [display, setDisplay] = useState('');

  const iRef = useRef(0);          // which prompt
  const cRef = useRef(0);          // char index
  const delRef = useRef(false);    // deleting?
  const holdTimerRef = useRef(null);
  const tickTimerRef = useRef(null);

  useEffect(() => () => {
    clearTimeout(tickTimerRef.current);
    clearTimeout(holdTimerRef.current);
  }, []);

  useEffect(() => {
    if (paused) {
      clearTimeout(tickTimerRef.current);
      clearTimeout(holdTimerRef.current);
      return;
    }

    const step = () => {
      const current = list[iRef.current] || '';

      if (!delRef.current && cRef.current === current.length) {
        if (!holdTimerRef.current) {
          holdTimerRef.current = setTimeout(() => {
            delRef.current = true;
            holdTimerRef.current = null;
            step();
          }, holdMs);
        }
        return;
      }

      if (delRef.current && cRef.current === 0) {
        delRef.current = false;
        iRef.current = (iRef.current + 1) % list.length;
      }

      const speed = delRef.current ? deleteMs : typeMs;

      tickTimerRef.current = setTimeout(() => {
        cRef.current += delRef.current ? -1 : 1;
        const next = (list[iRef.current] || '').slice(0, Math.max(0, cRef.current));
        setDisplay(next);
        step();
      }, speed);
    };

    step();

    return () => {
      clearTimeout(tickTimerRef.current);
      clearTimeout(holdTimerRef.current);
    };
  }, [list, typeMs, deleteMs, holdMs, paused]);

  return display;
}
