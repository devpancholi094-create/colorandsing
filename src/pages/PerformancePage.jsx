import { useCallback, useEffect, useRef, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import AnimatedCharacter from '../components/AnimatedCharacter.jsx';
import Backdrop from '../components/Backdrop.jsx';
import Button from '../components/Button.jsx';
import Burst from '../components/Burst.jsx';
import Confetti from '../components/Confetti.jsx';
import Icon from '../components/Icon.jsx';
import StageEffects from '../components/StageEffects.jsx';
import { DEMO_SECONDS } from '../config.js';
import { useApp } from '../hooks/AppContext.jsx';
import { isDocEmpty } from '../hooks/coloringSessions.js';
import { useSaveCreation } from '../hooks/useSaveCreation.js';
import { useShowTimeline } from '../hooks/useShowTimeline.js';
import { useStrokeSnapshot } from '../hooks/useStrokeSnapshot.js';
import {
  pauseRecordingPlayback,
  resumeRecordingPlayback,
  sfx,
  startJingle,
  startRecordingPlayback,
  stopAllAudio,
  stopJingle,
} from '../utils/audio.js';

const DEMO_MS = DEMO_SECONDS * 1000;

/**
 * The show. With a recording: the child's own voice plays (an <audio> element) and the
 * character dances until it ends. Without one ("Watch Demo"): the dance runs for a fixed
 * time with a quiet synthesized tune. Everything audible is stopped when leaving.
 * Phases: ready (needs a tap) -> playing <-> paused -> finished.
 */
export default function PerformancePage({ character, demo, navigate }) {
  const { getSession, recording, soundOn, toast, markPerformed, reducedMotion } = useApp();
  const doc = getSession(character.id).present;
  const snapshot = useStrokeSnapshot(character, doc.strokes);
  const save = useSaveCreation(character);
  const rec = !demo && recording && recording.characterId === character.id ? recording : null;

  const [phase, setPhaseState] = useState(() => (rec ? 'ready' : 'playing'));
  const [afterglow, setAfterglow] = useState(false); // keep dancing through the finale after a recording ends
  const afterglowTimer = useRef(null);
  const [needsTap, setNeedsTap] = useState(false); // browser blocked autoplay: show the big Start button
  const [runKey, setRunKey] = useState(0);
  const phaseRef = useRef(rec ? 'ready' : 'playing');
  const mounted = useRef(true);
  const demoTimer = useRef(null);
  const demoRemaining = useRef(DEMO_MS);
  const demoStartedAt = useRef(0);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  const setPhase = useCallback((next) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const finish = useCallback(() => {
    if (!mounted.current) return;
    clearTimeout(demoTimer.current);
    stopJingle();
    setPhase('finished');
    markPerformed(character.id);
    sfx('success');
    if (rec) {
      setAfterglow(true);
      clearTimeout(afterglowTimer.current);
      afterglowTimer.current = setTimeout(() => mounted.current && setAfterglow(false), 2600);
    }
  }, [setPhase, markPerformed, character.id, rec]);

  const runDemo = useCallback(
    (ms) => {
      demoStartedAt.current = performance.now();
      demoRemaining.current = ms;
      setPhase('playing');
      if (soundRef.current) startJingle();
      clearTimeout(demoTimer.current);
      demoTimer.current = setTimeout(finish, ms);
    },
    [setPhase, finish],
  );

  const start = useCallback(() => {
    stopAllAudio(); // guarantees no overlapping audio on replay
    clearTimeout(demoTimer.current);
    clearTimeout(afterglowTimer.current);
    setAfterglow(false);
    setRunKey((k) => k + 1);
    if (!rec) {
      runDemo(DEMO_MS);
      return;
    }
    setNeedsTap(false);
    setPhase('ready');
    startRecordingPlayback(rec.url, {
      muted: !soundRef.current,
      onPlaying: () => mounted.current && phaseRef.current !== 'paused' && setPhase('playing'),
      onEnded: finish,
      onError: () => {
        toast("We couldn't play the recording.");
        finish();
      },
    }).catch((error) => {
      if (!mounted.current) return;
      if (error && error.name === 'NotAllowedError') {
        setNeedsTap(true); // the browser wants a tap first: show the big Start button
        setPhase('ready');
      } else {
        toast("We couldn't play the recording.");
        finish();
      }
    });
  }, [rec, runDemo, setPhase, finish, toast]);

  const pause = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    setPhase('paused');
    if (rec) {
      pauseRecordingPlayback();
    } else {
      clearTimeout(demoTimer.current);
      stopJingle();
      demoRemaining.current -= performance.now() - demoStartedAt.current;
    }
  }, [rec, setPhase]);

  const resume = useCallback(() => {
    if (phaseRef.current !== 'paused') return;
    if (rec) {
      setPhase('playing');
      resumeRecordingPlayback().catch(() => setPhase('ready'));
    } else {
      runDemo(Math.max(500, demoRemaining.current));
    }
  }, [rec, runDemo, setPhase]);

  // Start when the screen opens (the child just tapped to get here). If the browser blocks
  // audio without a fresh tap, the stage shows a big Start button instead.
  useEffect(() => {
    mounted.current = true;
    start();
    return () => {
      mounted.current = false;
      clearTimeout(demoTimer.current);
      clearTimeout(afterglowTimer.current);
      stopAllAudio(); // leaving the screen always silences everything
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onHide = () => document.hidden && pause();
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [pause]);

  // Turning sound on in the middle of a demo brings the tune in.
  useEffect(() => {
    if (soundOn && !rec && phaseRef.current === 'playing') startJingle();
  }, [soundOn, rec]);

  const saveArtwork = () => {
    if (isDocEmpty(doc)) {
      toast('Color the picture first, then save it!');
      return;
    }
    save();
  };

  const showing = phase === 'playing' || phase === 'paused';
  const timeline = useShowTimeline({ phase, runKey, demo: !rec });
  const scene = phase === 'finished' ? 'finale' : timeline.scene;
  const dancing = showing || afterglow;
  const special = dancing && (scene === 'special' || scene === 'finale') && !reducedMotion;
  const burstScene = (showing || phase === 'finished') && ['enter', 'special', 'finale'].includes(scene);
  const lines = character.rhyme.lines;
  const mainAction = {
    ready: { label: 'Start the show!', icon: 'play', onClick: start },
    playing: { label: 'Pause', icon: 'pause', onClick: pause },
    paused: { label: 'Keep going', icon: 'play', onClick: resume },
    finished: { label: 'Play again', icon: 'replay', onClick: start },
  }[phase];

  return (
    <AppShell tone="stage" title={rec ? 'Your show!' : 'Demo show'} onBack={() => navigate(`/rhyme/${character.id}`)} backLabel="Back">
      <div className="perform">
        <div className="stage" data-type={character.animation.type} data-scene={scene} data-playing={dancing ? '1' : '0'}>
          <Backdrop theme={character.theme} />
          <StageEffects active={dancing} paused={phase === 'paused'} extra={character.animation.extra} />
          <div className="stage-char">
            <AnimatedCharacter
              character={character}
              fills={doc.fills}
              snapshot={snapshot}
              dancing={dancing}
              special={special}
              paused={phase === 'paused'}
              label={`${character.name} dancing`}
            />
          </div>
          {burstScene && <Burst key={`${runKey}-${scene}-${timeline.index}`} />}
          {showing && scene === 'enter' && (
            <div className="stage-title" key={`t${runKey}`}>
              {character.rhyme.title}
            </div>
          )}
          {!rec && showing && (
            <div className="stage-lyric" key={`l${runKey}-${Math.min(3, timeline.index)}`} aria-live="polite">
              {lines[Math.min(3, timeline.index)]}
            </div>
          )}
          {phase === 'ready' && needsTap && (
            <button type="button" className="stage-start" onClick={start}>
              <Icon name="play" size={44} />
              <span>Start the show!</span>
            </button>
          )}
          {phase === 'finished' && (
            <>
              <Confetti key={runKey} />
              <div className="stage-banner">{rec ? 'Great singing!' : 'Hooray!'}</div>
            </>
          )}
        </div>

        {!rec && <p className="panel-note stage-note">Demo dance. No recording needed.</p>}
        {rec && !soundOn && <p className="panel-note stage-note">Sound is off. Tap the speaker at the top to hear your song.</p>}

        <div className="perform-controls">
          <Button variant="primary" size="lg" icon={mainAction.icon} onClick={mainAction.onClick}>
            {mainAction.label}
          </Button>
          {showing && (
            <Button variant="soft" size="lg" icon="replay" onClick={start}>
              Replay
            </Button>
          )}
        </div>
        <div className="perform-links">
          <Button variant="mint" icon="brush" onClick={() => navigate(`/color/${character.id}`)}>
            Back to coloring
          </Button>
          <Button variant="sun" icon="save" onClick={saveArtwork}>
            Save Artwork
          </Button>
          <Button variant="soft" icon="home" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
