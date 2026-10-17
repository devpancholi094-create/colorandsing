import { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import Button from '../components/Button.jsx';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import Switch from '../components/Switch.jsx';
import { APP_NAME } from '../config.js';
import { useApp } from '../hooks/AppContext.jsx';
import { recordingSupported } from '../hooks/useRecorder.js';
import { getEnglishVoices, pickVoice, speakLines, speechSupported } from '../utils/audio.js';

function newQuestion() {
  const a = 6 + Math.floor(Math.random() * 7);
  const b = 4 + Math.floor(Math.random() * 6);
  return { a, b, answer: a + b };
}

/**
 * A small speed bump so a young child doesn't wander into settings by accident.
 * It is NOT security: any older child or adult can pass it, and it is not meant to be.
 */
function ParentGate({ onPass }) {
  const [question, setQuestion] = useState(newQuestion);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (Number(value) === question.answer) {
      onPass();
    } else {
      setWrong(true);
      setValue('');
      setQuestion(newQuestion());
    }
  };

  return (
    <form className="panel gate" onSubmit={submit}>
      <h2>Grown-ups only</h2>
      <p className="parent-text">To open this area, please answer: what is {question.a} + {question.b}?</p>
      <label className="gate-field">
        <span className="sr-only">Your answer</span>
        <input type="number" inputMode="numeric" value={value} onChange={(e) => { setValue(e.target.value); setWrong(false); }} autoFocus aria-invalid={wrong} />
      </label>
      {wrong && <p className="panel-error" role="alert">Not quite. Here is a new question.</p>}
      <Button type="submit" variant="primary" size="lg" icon="check">
        Open
      </Button>
      <p className="parent-fine">This is a simple check to keep little fingers out. It is not a security lock.</p>
    </form>
  );
}


/** Lets a grown-up pick which device voice reads the rhymes (default: an automatic female voice). */
function VoicePicker({ value, onChange, soundOn, toast }) {
  const [voices, setVoices] = useState(getEnglishVoices);
  useEffect(() => {
    if (!speechSupported()) return undefined;
    const refresh = () => setVoices(getEnglishVoices());
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
    refresh();
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', refresh);
  }, []);

  if (!speechSupported()) {
    return <p className="parent-text">This browser has no read-aloud voice. A grown-up can read the rhymes out loud instead.</p>;
  }
  const auto = pickVoice();
  const sample = () => {
    if (!soundOn) {
      toast('Sound is off. Turn it on to hear a sample.');
      return;
    }
    speakLines(["Hello, friend! Let's color and sing together."]);
  };
  return (
    <div className="voice-picker">
      <label className="voice-label" htmlFor="voice-select">Reading voice</label>
      <select id="voice-select" className="voice-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Automatic (friendly female voice){auto.voice ? `: ${auto.voice.name}` : ''}</option>
        {voices.map((v) => (
          <option key={v.name + v.lang} value={v.name}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
      <Button variant="sun" icon="speaker" onClick={sample}>
        Hear a sample
      </Button>
      <p className="parent-fine">Voices come from your device, so they differ between phones and computers. Voices marked Enhanced, Premium or Natural usually sound warmest. Install more in your device's language or accessibility settings.</p>
    </div>
  );
}

function Capability({ label, ok, detail }) {
  return (
    <li className="cap">
      <span className={`cap-dot ${ok ? 'ok' : 'no'}`} aria-hidden="true" />
      <span>
        <strong>{label}:</strong> {ok ? 'available' : 'not available'}
        {detail && <small> {detail}</small>}
      </span>
    </li>
  );
}

export default function ParentArea({ navigate }) {
  const { prefs, setPref, creations, deleteAllCreations, progress, resetProgress, toast } = useApp();
  const [unlocked, setUnlocked] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const support = useMemo(() => {
    let storage = false;
    try {
      storage = typeof window.localStorage !== 'undefined';
    } catch {
      storage = false;
    }
    return { mic: recordingSupported(), speech: speechSupported(), storage };
  }, []);

  return (
    <AppShell tone="home" title="Grown-ups" onBack={() => navigate('/')} backLabel="Home">
      {!unlocked ? (
        <ParentGate onPass={() => setUnlocked(true)} />
      ) : (
        <div className="parent">
          <section className="panel">
            <h2>Privacy</h2>
            <ul className="parent-list">
              <li><strong>Recordings stay on this device.</strong> Singing is recorded and played back by your browser. It is never uploaded, sent, or saved to storage. It is kept in memory only and is erased when you delete it, leave the show, or close or reload the page.</li>
              <li>There are no accounts, no ads, no analytics, no tracking, and no sharing buttons. {APP_NAME} does not ask for names, birthdays, emails, or locations.</li>
              <li>Colored pictures you save are stored in this browser only (local storage) so you can reopen them. Nothing leaves the device.</li>
              <li>The voice that reads the rhyme aloud, when available, is the device's built-in text-to-speech. It is never presented as your child's voice. The app does not analyze or identify voices.</li>
            </ul>
          </section>

          <section className="panel">
            <h2>Sound and motion</h2>
            <Switch checked={prefs.sound} onChange={(v) => setPref('sound', v)} label="Sound" hint="Turns off read-aloud, chimes, and playback." />
            <VoicePicker value={prefs.voiceName} onChange={(v) => setPref('voiceName', v)} soundOn={prefs.sound} toast={toast} />
            <Switch checked={prefs.gentleMotion} onChange={(v) => setPref('gentleMotion', v)} label="Gentle animations" hint="Smaller movements, no falling confetti. Also follows your device's reduce-motion setting." />
          </section>

          <section className="panel">
            <h2>This browser</h2>
            <ul className="caps">
              <Capability label="Microphone recording" ok={support.mic} />
              <Capability label="Read-aloud voice" ok={support.speech} />
              <Capability label="Saving pictures" ok={support.storage} />
            </ul>
            <p className="parent-text">Microphone support and recording formats vary between browsers and devices (for example, Safari records MP4 audio, while Chrome and Firefox record WebM or Ogg). Microphone access needs a secure page (https) and your permission each time the browser asks.</p>
            <p className="parent-text"><strong>If the microphone was blocked:</strong> open your browser's site settings for this page, set Microphone to Allow, then reload.</p>
          </section>

          <section className="panel">
            <h2>Saved data</h2>
            <p className="parent-text">
              {creations.length} saved {creations.length === 1 ? 'picture' : 'pictures'}. {Object.keys(progress.performed).length} {Object.keys(progress.performed).length === 1 ? 'friend has' : 'friends have'} danced.
            </p>
            <div className="panel-actions">
              <Button variant="danger" icon="trash" onClick={() => setConfirmDelete(true)} disabled={creations.length === 0 && Object.keys(progress.performed).length === 0}>
                Delete all saved pictures
              </Button>
            </div>
            <p className="parent-text"><strong>Clearing data yourself:</strong> in your browser's settings, find “Site data” or “Cookies and site data”, search for this website, and remove it. That erases saved pictures and settings.</p>
          </section>
        </div>
      )}

      <ConfirmationDialog
        open={confirmDelete}
        title="Delete all saved pictures?"
        message="Every saved picture and star will be removed from this browser. This can't be undone."
        confirmLabel="Yes, delete all"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteAllCreations();
          resetProgress();
          setConfirmDelete(false);
          toast('All saved pictures were deleted.');
        }}
      />
    </AppShell>
  );
}
