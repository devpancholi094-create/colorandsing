// localStorage helpers. Every call is wrapped: storage can be blocked (private mode),
// full, or hold data from an older version of the app.
import { STORAGE_PREFIX } from '../config.js';

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore */
  }
}

// ---- Settings -------------------------------------------------------------
export const DEFAULT_PREFS = { sound: true, gentleMotion: false, voiceName: '' };

export function loadPrefs() {
  const raw = readJSON('prefs.v1', {});
  return {
    sound: typeof raw.sound === 'boolean' ? raw.sound : DEFAULT_PREFS.sound,
    gentleMotion: typeof raw.gentleMotion === 'boolean' ? raw.gentleMotion : DEFAULT_PREFS.gentleMotion,
    voiceName: typeof raw.voiceName === 'string' ? raw.voiceName.slice(0, 120) : '',
  };
}

// ---- Progress (which friends have performed) ------------------------------
export function loadProgress() {
  const raw = readJSON('progress.v1', {});
  const performed = raw && typeof raw.performed === 'object' && raw.performed ? raw.performed : {};
  const clean = {};
  for (const [id, value] of Object.entries(performed)) if (value === true) clean[id] = true;
  return { performed: clean };
}

// ---- Creations -------------------------------------------------------------
const HEX = /^#[0-9a-fA-F]{3,8}$/;
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

function cleanStroke(raw) {
  if (!raw || (raw.tool !== 'brush' && raw.tool !== 'eraser')) return null;
  if (!isNum(raw.size) || raw.size <= 0 || raw.size > 200) return null;
  if (raw.tool === 'brush' && !HEX.test(raw.color)) return null;
  if (!Array.isArray(raw.points) || raw.points.length === 0 || raw.points.length > 5000) return null;
  const points = [];
  for (const p of raw.points) {
    if (!Array.isArray(p) || !isNum(p[0]) || !isNum(p[1])) return null;
    points.push([p[0], p[1]]);
  }
  return { tool: raw.tool, color: raw.tool === 'brush' ? raw.color : '#000', size: raw.size, points };
}

/**
 * Validate one saved creation against the current character list.
 * Returns a clean object, or null when the data is unusable (old format, corrupted...).
 * Unknown region ids and malformed strokes are dropped instead of crashing the app.
 */
export function sanitizeCreation(raw, getCharacter) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.id !== 'string' || !raw.id) return null;
  const character = getCharacter(raw.characterId);
  if (!character) return null;
  const regionIds = new Set(character.art.regions.map((r) => r.id));
  const fills = {};
  if (raw.fills && typeof raw.fills === 'object') {
    for (const [id, color] of Object.entries(raw.fills)) {
      if (regionIds.has(id) && typeof color === 'string' && HEX.test(color)) fills[id] = color;
    }
  }
  const strokes = Array.isArray(raw.strokes) ? raw.strokes.map(cleanStroke).filter(Boolean) : [];
  return {
    id: raw.id,
    v: 1,
    characterId: raw.characterId,
    fills,
    strokes,
    createdAt: isNum(raw.createdAt) ? raw.createdAt : Date.now(),
    updatedAt: isNum(raw.updatedAt) ? raw.updatedAt : Date.now(),
  };
}

export function loadCreations(getCharacter) {
  const raw = readJSON('creations.v1', []);
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => sanitizeCreation(item, getCharacter)).filter(Boolean);
}

export const saveCreations = (list) => writeJSON('creations.v1', list);

export const makeId = () =>
  `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
