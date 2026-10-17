import { useCallback } from 'react';
import { useApp } from './AppContext.jsx';
import { sfx } from '../utils/audio.js';

/** Saves the current coloring of a character to My Creations (updating it if it was saved before). */
export function useSaveCreation(character) {
  const { getSession, dispatchSession, saveCreation, toast } = useApp();
  const session = getSession(character.id);

  return useCallback(
    ({ quiet = false } = {}) => {
      const result = saveCreation(character.id, session.present, session.creationId);
      if (result.ok) {
        dispatchSession({ type: 'setCreationId', id: character.id, creationId: result.id });
        if (!quiet) {
          toast('Saved to My Creations!', 'good');
          sfx('success');
        }
        return true;
      }
      toast(
        result.reason === 'full'
          ? 'My Creations is full. Delete one to make room.'
          : "We couldn't save this. The browser storage may be full or blocked.",
        'warn',
      );
      return false;
    },
    [character.id, session.present, session.creationId, saveCreation, dispatchSession, toast],
  );
}
