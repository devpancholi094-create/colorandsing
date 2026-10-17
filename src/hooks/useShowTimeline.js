import { useEffect, useRef, useState } from 'react';

// The "video": a short choreographed sequence of scenes.
//   demo (10 s):  enter -> dance -> special move -> finale   (2.5 s each)
//   recording:    enter (2.5 s), then dance <-> special every 3 s for as long as the
//                 child's voice plays; the finale starts when the recording ends.
export const SCENE_MS = 2500;
const DEMO_SCENES = ['enter', 'dance', 'special', 'finale'];

export function sceneAt(ms, demo) {
  if (demo) {
    const index = Math.min(DEMO_SCENES.length - 1, Math.floor(ms / SCENE_MS));
    return { scene: DEMO_SCENES[index], index };
  }
  if (ms < SCENE_MS) return { scene: 'enter', index: 0 };
  const n = Math.floor((ms - SCENE_MS) / 3000);
  return { scene: n % 2 === 0 ? 'dance' : 'special', index: n + 1 };
}

/** Tracks show time (only while playing, so Pause really pauses) and reports the current scene. */
export function useShowTimeline({ phase, runKey, demo }) {
  const [state, setState] = useState({ scene: 'enter', index: 0 });
  const elapsed = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    elapsed.current = 0;
    setState({ scene: 'enter', index: 0 });
  }, [runKey]);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    last.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      elapsed.current += now - last.current;
      last.current = now;
      const next = sceneAt(elapsed.current, demo);
      setState((prev) => (prev.index === next.index ? prev : next)); // re-render only on scene change
    }, 100);
    return () => clearInterval(id);
  }, [phase, demo, runKey]);

  return state;
}
