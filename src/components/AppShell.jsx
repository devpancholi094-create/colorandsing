import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { useApp } from '../hooks/AppContext.jsx';
import { sfx } from '../utils/audio.js';

/** Page frame: top bar (back / title / sound toggle), content, and the toast. */
export default function AppShell({ title, onBack, backLabel = 'Back', left, right, tone = 'home', children }) {
  const { soundOn, setPref, toastState } = useApp();

  const toggleSound = () => {
    setPref('sound', !soundOn);
    if (!soundOn) setTimeout(() => sfx('tap'), 50); // gentle confirmation when turning ON
  };

  return (
    <div className="app" data-tone={tone}>
      <header className="bar">
        <div className="bar-side">
          {left || (onBack && (
            <Button variant="ghost" icon="back" onClick={onBack}>
              {backLabel}
            </Button>
          ))}
        </div>
        {title && <h1 className="bar-title">{title}</h1>}
        <div className="bar-side bar-side-end">
          {right}
          <button
            type="button"
            className="sound-toggle"
            aria-pressed={soundOn}
            onClick={toggleSound}
            aria-label={soundOn ? 'Sound is on. Turn sound off' : 'Sound is off. Turn sound on'}
          >
            <Icon name={soundOn ? 'speaker' : 'speakerOff'} />
            <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>
      </header>
      <main className="page">{children}</main>
      {toastState && (
        <div key={toastState.id} className="toast" data-tone={toastState.tone} role="status" aria-live="polite">
          {toastState.tone === 'good' && <Icon name="star" size={20} />}
          {toastState.message}
        </div>
      )}
    </div>
  );
}
