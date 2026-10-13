// Everything that makes sound lives here so we can guarantee ONE sound source at a time:
//  - playback of the child's own recording (an <audio> element)
//  - browser text-to-speech reading the rhyme (never presented as the child's voice)
//  - tiny synthesized chimes / a quiet demo jingle (Web Audio, no files, no network)
// Nothing here starts by itself: callers must be reacting to a tap.

let soundEnabled = true;

export function setSoundEnabled(on) {
  soundEnabled = on;
  // A recording that is already playing is muted (not stopped) so the dance keeps its timing.
  if (activeAudio) activeAudio.muted = !on;
  if (!on) {
    stopSpeech();
    stopJingle();
  }
}
export const isSoundEnabled = () => soundEnabled;

// ---------------------------------------------------------------------------
// Recording playback
// ---------------------------------------------------------------------------
let activeAudio = null;

export function stopRecordingPlayback() {
  if (!activeAudio) return;
  const audio = activeAudio;
  activeAudio = null;
  audio.onended = null;
  audio.onplaying = null;
  audio.onerror = null;
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
}

/**
 * Plays a recording from the start. Stops anything else first (no overlap).
 * Returns a promise that rejects if the browser refuses to start playback.
 */
export function startRecordingPlayback(url, { onPlaying, onEnded, onError, muted = false } = {}) {
  stopAllAudio();
  const audio = new Audio();
  audio.preload = 'auto';
  audio.muted = muted;
  audio.src = url;
  activeAudio = audio;
  audio.onplaying = () => onPlaying && onPlaying();
  audio.onended = () => {
    if (activeAudio === audio) activeAudio = null;
    onEnded && onEnded();
  };
  audio.onerror = () => {
    if (activeAudio === audio) activeAudio = null;
    onError && onError();
  };
  return audio.play();
}

export function pauseRecordingPlayback() {
  if (activeAudio) activeAudio.pause();
}

export function resumeRecordingPlayback() {
  return activeAudio ? activeAudio.play() : Promise.resolve();
}

export function hasRecordingPlayback() {
  return Boolean(activeAudio);
}

// ---------------------------------------------------------------------------
// Text-to-speech (optional; reads the rhyme in a computer voice)
// ---------------------------------------------------------------------------
export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let speechToken = 0;

export function stopSpeech() {
  speechToken += 1;
  if (speechSupported()) window.speechSynthesis.cancel();
}

export function speakLines(lines, { onLine, onEnd } = {}) {
  if (!speechSupported()) return false;
  stopAllAudio();
  const token = ++speechToken;
  const synth = window.speechSynthesis;
  lines.forEach((line, index) => {
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.15;
    utterance.volume = 0.9;
    utterance.onstart = () => token === speechToken && onLine && onLine(index);
    const finish = () => {
      if (token !== speechToken) return;
      if (index === lines.length - 1) onEnd && onEnd();
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    synth.speak(utterance);
  });
  return true;
}

// ---------------------------------------------------------------------------
// Gentle synthesized sounds (all quiet, short, and only after a tap)
// ---------------------------------------------------------------------------
let audioContext = null;

function getContext() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function tone(freq, { start = 0, duration = 0.22, gain = 0.05, type = 'sine' } = {}) {
  const ctx = getContext();
  if (!ctx) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

const NOTE = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5 };

export function sfx(name) {
  if (!soundEnabled) return;
  try {
    if (name === 'tap') tone(NOTE.E5, { duration: 0.12, gain: 0.035 });
    if (name === 'pop') tone(NOTE.A5, { duration: 0.14, gain: 0.04, type: 'triangle' });
    if (name === 'erase') tone(NOTE.C5, { duration: 0.1, gain: 0.03, type: 'triangle' });
    if (name === 'success') {
      [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) => tone(f, { start: i * 0.11, duration: 0.3, gain: 0.045, type: 'triangle' }));
    }
  } catch {
    /* sound is a nice-to-have */
  }
}

// A quiet pentatonic music-box tune for the "Watch Demo" mode (no recording needed).
const JINGLE = ['C5', 'E5', 'G5', 'E5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5', 'C5'];
let jingleTimer = null;

export function stopJingle() {
  if (jingleTimer) {
    clearInterval(jingleTimer);
    jingleTimer = null;
  }
}

export function startJingle() {
  stopJingle();
  if (!soundEnabled) return;
  let step = 0;
  const play = () => {
    try {
      tone(NOTE[JINGLE[step % JINGLE.length]], { duration: 0.4, gain: 0.04, type: 'triangle' });
    } catch {
      /* ignore */
    }
    step += 1;
  };
  play();
  jingleTimer = setInterval(play, 420);
}

export function stopAllAudio() {
  stopSpeech();
  stopRecordingPlayback();
  stopJingle();
}
