import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { MAX_RECORDING_SECONDS } from '../config.js';
import { useRecorder } from '../hooks/useRecorder.js';
import { useApp } from '../hooks/AppContext.jsx';
import { startRecordingPlayback, stopRecordingPlayback } from '../utils/audio.js';
import { formatTime } from '../utils/format.js';

function MicIllustration({ live }) {
  return (
    <svg className={`mic-art ${live ? 'is-live' : ''}`} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="#ffe3ea" />
      <rect x="44" y="18" width="32" height="54" rx="16" fill="#ff8fa3" stroke="#37315c" strokeWidth="4" />
      <path d="M52 34h16M52 44h16M52 54h16" stroke="#37315c" strokeWidth="3" strokeLinecap="round" opacity=".5" />
      <path d="M32 58a28 28 0 0 0 56 0" fill="none" stroke="#37315c" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 86v16M46 102h28" stroke="#37315c" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Sing-and-record panel. Flow: Let Me Sing! -> friendly explanation -> permission prompt
 * (only after the child/grown-up taps "Okay") -> recording with timer -> review/replay ->
 * make the character dance. The recording stays in memory; it is never uploaded or stored.
 */
export default function RecordingControls({ characterId, recording, onRecorded, onDelete, onDance, onDemo }) {
  const { soundOn, toast } = useApp();
  const [explaining, setExplaining] = useState(false);
  const [playing, setPlaying] = useState(false);
  const explainedRef = useRef(false);

  const recorder = useRecorder({
    onRecorded: (result) => {
      setExplaining(false);
      onRecorded({ ...result, characterId });
    },
  });

  // Never leave a replay running when this panel goes away.
  useEffect(() => () => stopRecordingPlayback(), []);

  const begin = () => {
    recorder.clearError();
    if (explainedRef.current) {
      recorder.start();
    } else {
      setExplaining(true);
    }
  };

  const confirmMic = () => {
    explainedRef.current = true;
    setExplaining(false);
    recorder.start();
  };

  const togglePlayback = () => {
    if (playing) {
      stopRecordingPlayback();
      setPlaying(false);
      return;
    }
    if (!soundOn) {
      toast('Sound is off. Tap the speaker at the top to hear it.');
      return;
    }
    setPlaying(true);
    startRecordingPlayback(recording.url, {
      onEnded: () => setPlaying(false),
      onError: () => {
        setPlaying(false);
        toast("We couldn't play that. Try recording again.");
      },
    }).catch(() => {
      setPlaying(false);
      toast("We couldn't play that. Try recording again.");
    });
  };

  const record = () => {
    stopRecordingPlayback();
    setPlaying(false);
    onDelete();
    begin();
  };

  const remove = () => {
    stopRecordingPlayback();
    setPlaying(false);
    onDelete();
  };

  // ---- Recording in progress -------------------------------------------
  if (recorder.status === 'recording') {
    const progress = Math.min(100, (recorder.elapsed / (MAX_RECORDING_SECONDS * 1000)) * 100);
    return (
      <section className="panel rec-panel is-recording" aria-live="polite">
        <MicIllustration live />
        <div className="rec-badge">
          <span className="rec-dot" aria-hidden="true" /> Recording
        </div>
        <div className="rec-time" aria-label={`Recording time ${formatTime(recorder.elapsed)}`}>
          {formatTime(recorder.elapsed)} <small>/ {formatTime(MAX_RECORDING_SECONDS * 1000)}</small>
        </div>
        <div className="rec-bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="panel-note">Sing the rhyme now!</p>
        <Button variant="danger" size="lg" icon="stop" onClick={recorder.stop}>
          Stop
        </Button>
      </section>
    );
  }

  if (recorder.status === 'requesting') {
    return (
      <section className="panel rec-panel" aria-live="polite">
        <MicIllustration />
        <p className="panel-title">Tap “Allow” to use the microphone</p>
        <p className="panel-note">A grown-up may need to help with this step.</p>
      </section>
    );
  }

  // ---- Friendly explanation before asking for the microphone -------------------
  if (explaining) {
    return (
      <section className="panel rec-panel">
        <MicIllustration />
        <p className="panel-title">Time to sing!</p>
        <p className="panel-note">
          Your device will ask to use the microphone so it can hear you sing. Your voice stays on this device. It is never sent anywhere.
        </p>
        <div className="panel-actions">
          <Button variant="primary" size="lg" icon="mic" onClick={confirmMic}>
            Okay, let’s sing!
          </Button>
          <Button variant="ghost" onClick={() => setExplaining(false)}>
            Not now
          </Button>
        </div>
      </section>
    );
  }

  // ---- Review a finished recording -----------------------------------------
  if (recording) {
    return (
      <section className="panel rec-panel is-done">
        <p className="panel-title">
          <Icon name="star" size={22} /> Great singing! ({formatTime(recording.ms)})
        </p>
        <div className="panel-actions">
          <Button variant="sun" size="lg" icon={playing ? 'stop' : 'play'} onClick={togglePlayback}>
            {playing ? 'Stop' : 'Hear my singing'}
          </Button>
          <Button variant="primary" size="lg" icon="star" onClick={onDance}>
            Make My Character Dance!
          </Button>
        </div>
        <div className="panel-actions panel-actions-small">
          <Button variant="soft" icon="mic" onClick={record}>
            Record again
          </Button>
          <Button variant="ghost" icon="trash" onClick={remove}>
            Delete recording
          </Button>
        </div>
      </section>
    );
  }

  // ---- Ready to record (or can't) ---------------------------------------------
  return (
    <section className="panel rec-panel">
      <MicIllustration />
      {recorder.error && (
        <p className="panel-error" role="alert">
          {recorder.error.message}
        </p>
      )}
      {!recorder.supported ? (
        <p className="panel-note">This browser can't record sound, but you can still watch the dance!</p>
      ) : (
        <Button variant="primary" size="lg" icon="mic" onClick={begin}>
          {recorder.error ? 'Try again' : 'Let Me Sing!'}
        </Button>
      )}
      <Button variant="mint" size="lg" icon="play" onClick={onDemo}>
        Watch Demo
      </Button>
      <p className="panel-note">The demo plays the dance without a recording.</p>
    </section>
  );
}
