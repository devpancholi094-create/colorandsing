import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import AnimatedCharacter from '../components/AnimatedCharacter.jsx';
import Button from '../components/Button.jsx';
import RecordingControls from '../components/RecordingControls.jsx';
import { useApp } from '../hooks/AppContext.jsx';
import { useStrokeSnapshot } from '../hooks/useStrokeSnapshot.js';
import { speakLines, speechSupported, stopSpeech } from '../utils/audio.js';

export default function RhymePage({ character, navigate }) {
  const { getSession, recording, setRecording, clearRecording, soundOn, toast } = useApp();
  const doc = getSession(character.id).present;
  const snapshot = useStrokeSnapshot(character, doc.strokes);
  const { lines, title } = character.rhyme;

  const [speaking, setSpeaking] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [practice, setPractice] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const canSpeak = speechSupported();

  // A recording belongs to one character; drop a stale one from a different friend.
  useEffect(() => {
    if (recording && recording.characterId !== character.id) clearRecording();
  }, [recording, character.id, clearRecording]);

  useEffect(() => () => stopSpeech(), []);

  const readAloud = (toRead, highlight = false) => {
    if (!soundOn) {
      toast('Sound is off. Tap the speaker at the top to hear it.');
      return;
    }
    setSpeaking(true);
    const started = speakLines(toRead, {
      onLine: (i) => highlight && setActiveLine(i),
      onEnd: () => {
        setSpeaking(false);
        setActiveLine(-1);
      },
    });
    if (!started) setSpeaking(false);
  };

  const toggleListen = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      setActiveLine(-1);
    } else {
      readAloud(lines, true);
    }
  };

  const goDance = () => navigate(`/perform/${character.id}`);
  const goDemo = () => navigate(`/perform/${character.id}?demo=1`);
  const hasRecording = recording && recording.characterId === character.id;

  return (
    <AppShell tone="sing" title={title} onBack={() => navigate(`/color/${character.id}`)} backLabel="Back to coloring">
      <div className="sing" style={{ '--tint': character.theme.tint }}>
        <div className="sing-hero">
          <AnimatedCharacter character={character} fills={doc.fills} snapshot={snapshot} label={`Your colored ${character.name}`} />
        </div>

        <div className="sing-main">
          {practice ? (
            <section className="panel practice" aria-live="polite">
              <p className="practice-count">
                Line {practiceIndex + 1} of {lines.length}
              </p>
              <p className="practice-line">{lines[practiceIndex]}</p>
              <div className="practice-dots" aria-hidden="true">
                {lines.map((_, i) => (
                  <span key={i} className={i === practiceIndex ? 'on' : i < practiceIndex ? 'done' : ''} />
                ))}
              </div>
              <div className="panel-actions">
                {canSpeak && (
                  <Button variant="sun" size="lg" icon="speaker" onClick={() => readAloud([lines[practiceIndex]])}>
                    Hear this line
                  </Button>
                )}
                <Button variant="soft" icon="prev" disabled={practiceIndex === 0} onClick={() => { stopSpeech(); setPracticeIndex((i) => i - 1); }}>
                  Back
                </Button>
                {practiceIndex < lines.length - 1 ? (
                  <Button variant="primary" size="lg" icon="next" onClick={() => { stopSpeech(); setPracticeIndex((i) => i + 1); }}>
                    Next line
                  </Button>
                ) : (
                  <Button variant="primary" size="lg" icon="check" onClick={() => { stopSpeech(); setPractice(false); setPracticeIndex(0); }}>
                    All done!
                  </Button>
                )}
              </div>
              <Button variant="ghost" icon="x" onClick={() => { stopSpeech(); setSpeaking(false); setPractice(false); setPracticeIndex(0); }}>
                Stop practicing
              </Button>
            </section>
          ) : (
            <section className="panel rhyme-card" aria-label="The rhyme">
              {lines.map((line, i) => (
                <p key={i} className={`rhyme-line ${activeLine === i ? 'is-active' : ''}`}>
                  {line}
                </p>
              ))}
              <div className="panel-actions">
                {canSpeak ? (
                  <Button variant="sun" size="lg" icon={speaking ? 'stop' : 'speaker'} onClick={toggleListen}>
                    {speaking ? 'Stop' : 'Listen to the Rhyme'}
                  </Button>
                ) : (
                  <p className="panel-note">This device can’t read aloud. A grown-up can read the rhyme out loud!</p>
                )}
                <Button variant="soft" icon="list" onClick={() => { stopSpeech(); setSpeaking(false); setActiveLine(-1); setPractice(true); }}>
                  Practice line by line
                </Button>
              </div>
            </section>
          )}

          <RecordingControls
            characterId={character.id}
            recording={hasRecording ? recording : null}
            onRecorded={setRecording}
            onDelete={clearRecording}
            onDance={goDance}
            onDemo={goDemo}
          />
        </div>
      </div>
    </AppShell>
  );
}
