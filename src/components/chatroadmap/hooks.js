
import { useEffect, useState } from "react";

export function useAutoScroll(ref, deps) {
    useEffect(() => {
        if (ref?.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }

    }, deps);
}

export function useTypewriter(prompts, paused) {
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