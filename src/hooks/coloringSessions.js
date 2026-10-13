// Coloring state, one "session" per character, kept in memory while the app is open.
// Each session is an undo/redo history of immutable documents:
//   doc = { fills: { [regionId]: '#hex' }, strokes: [ ...freehand strokes ] }
// A "patch" describes one user action (a fill, a stroke, an eraser tap, or clear all).
const HISTORY_LIMIT = 60;

export const emptyDoc = () => ({ fills: {}, strokes: [] });
export const isDocEmpty = (doc) => Object.keys(doc.fills).length === 0 && doc.strokes.length === 0;

export const newSession = (doc = emptyDoc(), creationId = null) => ({ present: doc, past: [], future: [], creationId });
export const EMPTY_SESSION = newSession();

export function applyPatch(doc, patch) {
  if (patch.clear) return emptyDoc();
  const fills = { ...doc.fills };
  if (patch.fills) {
    for (const [id, color] of Object.entries(patch.fills)) {
      if (color == null) delete fills[id];
      else fills[id] = color;
    }
  }
  const strokes = patch.stroke ? [...doc.strokes, patch.stroke] : doc.strokes;
  return { fills, strokes };
}

export function sessionsReducer(state, action) {
  const current = state[action.id] || EMPTY_SESSION;
  switch (action.type) {
    case 'commit': {
      const next = applyPatch(current.present, action.patch);
      return {
        ...state,
        [action.id]: { ...current, present: next, past: [...current.past, current.present].slice(-HISTORY_LIMIT), future: [] },
      };
    }
    case 'undo': {
      if (!current.past.length) return state;
      const previous = current.past[current.past.length - 1];
      return { ...state, [action.id]: { ...current, present: previous, past: current.past.slice(0, -1), future: [current.present, ...current.future] } };
    }
    case 'redo': {
      if (!current.future.length) return state;
      const [next, ...rest] = current.future;
      return { ...state, [action.id]: { ...current, present: next, past: [...current.past, current.present], future: rest } };
    }
    case 'load':
      return { ...state, [action.id]: newSession(action.doc, action.creationId) };
    case 'setCreationId':
      return { ...state, [action.id]: { ...current, creationId: action.creationId } };
    case 'forgetCreation': {
      // A creation was deleted: sessions pointing at it become "unsaved" again.
      const next = {};
      for (const [id, session] of Object.entries(state)) {
        next[id] = session.creationId === action.creationId ? { ...session, creationId: null } : session;
      }
      return next;
    }
    case 'forgetAllCreations': {
      const next = {};
      for (const [id, session] of Object.entries(state)) next[id] = { ...session, creationId: null };
      return next;
    }
    default:
      return state;
  }
}
