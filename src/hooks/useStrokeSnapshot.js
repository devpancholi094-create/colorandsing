import { useMemo } from 'react';
import { renderStrokesToDataURL } from '../utils/strokes.js';

/** PNG of the child's freehand brush strokes (or null if they only used fill). */
export function useStrokeSnapshot(character, strokes) {
  return useMemo(() => renderStrokesToDataURL(character.art, strokes, 600), [character, strokes]);
}
