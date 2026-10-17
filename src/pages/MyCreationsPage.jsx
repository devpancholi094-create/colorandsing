import { useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import AnimatedCharacter from '../components/AnimatedCharacter.jsx';
import ArtworkPreview from '../components/ArtworkPreview.jsx';
import Button from '../components/Button.jsx';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import { CHARACTERS, getCharacter } from '../data/characters.js';
import { useApp } from '../hooks/AppContext.jsx';
import { formatDate } from '../utils/format.js';

export default function MyCreationsPage({ navigate }) {
  const { creations, deleteCreation, dispatchSession, toast } = useApp();
  const [pendingDelete, setPendingDelete] = useState(null);

  const open = (creation) => {
    dispatchSession({ type: 'load', id: creation.characterId, doc: { fills: creation.fills, strokes: creation.strokes }, creationId: creation.id });
    navigate(`/color/${creation.characterId}`);
  };

  return (
    <AppShell tone="home" title="My Creations" onBack={() => navigate('/')} backLabel="Home">
      {creations.length === 0 ? (
        <div className="empty">
          <div className="empty-art">
            <AnimatedCharacter character={CHARACTERS[0]} label="A friendly dino" />
          </div>
          <p className="lead">Nothing here yet!</p>
          <p className="empty-line">Color a picture and it will show up here.</p>
          <Button variant="primary" size="lg" icon="star" onClick={() => navigate('/pick')}>
            Let’s Create!
          </Button>
        </div>
      ) : (
        <ul className="creations">
          {creations.map((creation) => {
            const character = getCharacter(creation.characterId);
            return (
              <li key={creation.id} className="creation-card">
                <button type="button" className="creation-open" onClick={() => open(creation)} aria-label={`Open your ${character.name}`}>
                  <ArtworkPreview character={character} doc={creation} />
                  <span className="creation-name">{character.name}</span>
                  <span className="creation-date">{formatDate(creation.updatedAt)}</span>
                </button>
                <Button variant="ghost" icon="trash" onClick={() => setPendingDelete(creation)}>
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        title="Delete this picture?"
        message="It will be gone for good."
        confirmLabel="Yes, delete it"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteCreation(pendingDelete.id);
          setPendingDelete(null);
          toast('Picture deleted.');
        }}
      />
    </AppShell>
  );
}
