import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_RECORDING_SECONDS } from '../config.js';

// Formats differ by browser: Chrome/Firefox/Edge -> webm/ogg, Safari -> mp4.
const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg'];
const MIN_RECORDING_MS = 400;

export function recordingSupported() {
  return (
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined'
  );
}

function pickMimeType() {
  if (typeof MediaRecorder.isTypeSupported !== 'function') return '';
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

const ERRORS = {
  unsupported: "This browser can't record sound. You can still watch the demo!",
  denied: 'The microphone is turned off for this page. A grown-up can turn it on in the browser settings, then try again.',
  'no-mic': "We couldn't find a microphone on this device.",
  busy: 'Another app is using the microphone. Close it and try again.',
  empty: "We didn't hear anything. Tap the mic and try again!",
  failed: 'Something went wrong while recording. Please try again.',
};

function errorFromException(error) {
  const name = error && error.name;
  if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') return 'denied';
  if (name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'DevicesNotFoundError') return 'no-mic';
  if (name === 'NotReadableError' || name === 'AbortError' || name === 'TrackStartError') return 'busy';
  return 'failed';
}

/**
 * Records from the microphone with the browser's own MediaRecorder.
 * - Permission is requested only when start() is called (after a tap).
 * - Stops automatically at MAX_RECORDING_SECONDS.
 * - Microphone tracks are stopped the moment recording ends (or the page unmounts).
 * - Audio is kept in memory only; it is never uploaded or written to storage.
 * onRecorded({ blob, url, mimeType, ms }) receives the result.
 */
export function useRecorder({ onRecorded }) {
  const [status, setStatus] = useState('idle'); // idle | requesting | recording
  const [elapsed, setElapsed] = useState(0);
  const [errorCode, setErrorCode] = useState(null);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startedAtRef = useRef(0);
  const discardRef = useRef(false);
  const aliveRef = useRef(true);
  const onRecordedRef = useRef(onRecorded);
  onRecordedRef.current = onRecorded;

  const releaseStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        /* already stopped */
      }
    }
    clearTimer();
    releaseStream(); // mic light goes off right away
  }, [clearTimer, releaseStream]);

  const cancel = useCallback(() => {
    discardRef.current = true;
    stop();
    recorderRef.current = null;
  }, [stop]);

  const start = useCallback(async () => {
    if (status === 'recording' || status === 'requesting') return;
    setErrorCode(null);
    if (!recordingSupported()) {
      setErrorCode('unsupported');
      return;
    }
    discardRef.current = false;
    setStatus('requesting');

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    } catch (error) {
      if (aliveRef.current) {
        setErrorCode(errorFromException(error));
        setStatus('idle');
      }
      return;
    }

    // The child may have left the screen while the permission prompt was open.
    if (!aliveRef.current || discardRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    streamRef.current = stream;
    let recorder;
    try {
      const mimeType = pickMimeType();
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch {
      releaseStream();
      setErrorCode('unsupported');
      setStatus('idle');
      return;
    }

    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onerror = () => {
      discardRef.current = true;
      stop();
      if (aliveRef.current) {
        setErrorCode('failed');
        setStatus('idle');
      }
    };
    recorder.onstop = () => {
      clearTimer();
      releaseStream();
      const ms = Math.round(performance.now() - startedAtRef.current);
      const type = recorder.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type });
      chunksRef.current = [];
      recorderRef.current = null;
      if (!aliveRef.current) return;
      setStatus('idle');
      if (discardRef.current) return;
      if (blob.size === 0 || ms < MIN_RECORDING_MS) {
        setErrorCode('empty');
        return;
      }
      onRecordedRef.current({ blob, url: URL.createObjectURL(blob), mimeType: type, ms });
    };

    recorderRef.current = recorder;
    startedAtRef.current = performance.now();
    setElapsed(0);
    try {
      recorder.start(250);
    } catch {
      releaseStream();
      setErrorCode('failed');
      setStatus('idle');
      return;
    }
    setStatus('recording');
    timerRef.current = setInterval(() => {
      const ms = performance.now() - startedAtRef.current;
      setElapsed(ms);
      if (ms >= MAX_RECORDING_SECONDS * 1000) stop();
    }, 200);
  }, [status, stop, clearTimer, releaseStream]);

  // Leaving the screen mid-recording discards it and frees the microphone.
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      cancel();
    };
  }, [cancel]);

  return {
    supported: recordingSupported(),
    status,
    elapsed,
    error: errorCode ? { code: errorCode, message: ERRORS[errorCode] } : null,
    clearError: () => setErrorCode(null),
    start,
    stop,
  };
}
