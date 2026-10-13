import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { getCharacter } from '../data/characters.js';
import { MAX_CREATIONS } from '../config.js';
import {
  loadCreations,
  loadPrefs,
  loadProgress,
  makeId,
  removeKey,
  saveCreations,
  writeJSON,
} from '../utils/storage.js';
import { setSoundEnabled, stopRecordingPlayback } from '../utils/audio.js';
import { EMPTY_SESSION, sessionsReducer } from './coloringSessions.js';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function useSystemReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

export function AppProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [creations, setCreations] = useState(() => loadCreations(getCharacter));
  const [progress, setProgress] = useState(loadProgress);
  const [sessions, dispatchSession] = useReducer(sessionsReducer, {});
  const [recording, setRecordingState] = useState(null);
  const [toastState, setToastState] = useState(null);

  const creationsRef = useRef(creations);
  creationsRef.current = creations;
  const recordingRef = useRef(null);
  const toastTimer = useRef(null);

  // ---- Settings -----------------------------------------------------------
  useEffect(() => {
    setSoundEnabled(prefs.sound);
    writeJSON('prefs.v1', prefs);
  }, [prefs]);

  const systemReduced = useSystemReducedMotion();
  const reducedMotion = prefs.gentleMotion || systemReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
  }, [reducedMotion]);

  const setPref = useCallback((key, value) => setPrefs((p) => ({ ...p, [key]: value })), []);

  // ---- Toast ----------------------------------------------------------------
  const toast = useCallback((message, tone = 'info') => {
    clearTimeout(toastTimer.current);
    setToastState({ message, tone, id: Date.now() });
    toastTimer.current = setTimeout(() => setToastState(null), 3200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ---- Recording (memory only: never written to storage) -------------------
  const clearRecording = useCallback(() => {
    stopRecordingPlayback();
    if (recordingRef.current) {
      URL.revokeObjectURL(recordingRef.current.url);
      recordingRef.current = null;
    }
    setRecordingState(null);
  }, []);

  const setRecording = useCallback((next) => {
    stopRecordingPlayback();
    if (recordingRef.current) URL.revokeObjectURL(recordingRef.current.url);
    recordingRef.current = next;
    setRecordingState(next);
  }, []);

  useEffect(
    () => () => {
      if (recordingRef.current) URL.revokeObjectURL(recordingRef.current.url);
    },
    [],
  );

  // ---- Creations (localStorage) ------------------------------------------
  const saveCreation = useCallback((characterId, doc, existingId) => {
    const list = creationsRef.current;
    const now = Date.now();
    const existing = list.find((c) => c.id === existingId);
    let next;
    let id;
    if (existing) {
      id = existing.id;
      next = list.map((c) => (c.id === id ? { ...c, fills: doc.fills, strokes: doc.strokes, updatedAt: now } : c));
    } else {
      if (list.length >= MAX_CREATIONS) return { ok: false, reason: 'full' };
      id = makeId();
      next = [{ id, v: 1, characterId, fills: doc.fills, strokes: doc.strokes, createdAt: now, updatedAt: now }, ...list];
    }
    const result = saveCreations(next);
    if (!result.ok) return { ok: false, reason: 'storage' };
    creationsRef.current = next;
    setCreations(next);
    return { ok: true, id };
  }, []);

  const deleteCreation = useCallback((id) => {
    const next = creationsRef.current.filter((c) => c.id !== id);
    saveCreations(next);
    creationsRef.current = next;
    setCreations(next);
    dispatchSession({ type: 'forgetCreation', creationId: id });
  }, []);

  const deleteAllCreations = useCallback(() => {
    removeKey('creations.v1');
    creationsRef.current = [];
    setCreations([]);
    dispatchSession({ type: 'forgetAllCreations' });
  }, []);

  // ---- Progress ---------------------------------------------------------------
  const markPerformed = useCallback((characterId) => {
    setProgress((p) => {
      if (p.performed[characterId]) return p;
      const next = { performed: { ...p.performed, [characterId]: true } };
      writeJSON('progress.v1', next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    removeKey('progress.v1');
    setProgress({ performed: {} });
  }, []);

  const getSession = useCallback((id) => sessions[id] || EMPTY_SESSION, [sessions]);

  const value = useMemo(
    () => ({
      prefs,
      setPref,
      soundOn: prefs.sound,
      reducedMotion,
      creations,
      saveCreation,
      deleteCreation,
      deleteAllCreations,
      progress,
      markPerformed,
      resetProgress,
      sessions,
      getSession,
      dispatchSession,
      recording,
      setRecording,
      clearRecording,
      toast,
      toastState,
    }),
    [prefs, setPref, reducedMotion, creations, saveCreation, deleteCreation, deleteAllCreations, progress, markPerformed, resetProgress, sessions, getSession, recording, setRecording, clearRecording, toast, toastState],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
