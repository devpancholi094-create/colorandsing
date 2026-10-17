import { useCallback, useEffect, useRef, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import Button from '../components/Button.jsx';
import ColorPalette from '../components/ColorPalette.jsx';
import ColoringCanvas from '../components/ColoringCanvas.jsx';
import Confetti from '../components/Confetti.jsx';
import ConfirmationDialog from '../components/ConfirmationDialog.jsx';
import DrawingToolbar from '../components/DrawingToolbar.jsx';
import SVGColoringArtwork from '../components/SVGColoringArtwork.jsx';
import { BRUSH_SIZES, PALETTE } from '../data/palette.js';
import { useApp } from '../hooks/AppContext.jsx';
import { isDocEmpty } from '../hooks/coloringSessions.js';
import { useSaveCreation } from '../hooks/useSaveCreation.js';
import { sfx } from '../utils/audio.js';

export default function ColoringPage({ character, navigate }) {
  const { getSession, dispatchSession } = useApp();
  const session = getSession(character.id);
  const doc = session.present;

  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState(PALETTE[6].value);
  const [size, setSize] = useState(BRUSH_SIZES[1].value);
  const [confirmClear, setConfirmClear] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = useCallback(
    (patch) => {
      // Skip fills that wouldn't change anything so Undo never has "empty" steps.
      if (patch.fills && !patch.stroke) {
        const same = Object.entries(patch.fills).every(([id, c]) => (c == null ? !(id in doc.fills) : doc.fills[id] === c));
        if (same) return;
      }
      dispatchSession({ type: 'commit', id: character.id, patch });
      if (patch.fills && !patch.stroke) sfx('pop');
    },
    [dispatchSession, character.id, doc.fills],
  );

  const pickColor = (value) => {
    setColor(value);
    if (tool === 'eraser') setTool('brush');
    sfx('tap');
  };

  const save = useSaveCreation(character);

  const done = () => {
    if (!isDocEmpty(doc)) save({ quiet: true }); // keep it safe in My Creations
    setCelebrating(true);
    sfx('success');
    timer.current = setTimeout(() => navigate(`/rhyme/${character.id}`), 1300);
  };

  return (
    <AppShell tone="color" title={`Color the ${character.name}`} onBack={() => navigate('/pick')} backLabel="Back">
      <div className="coloring" style={{ '--tint': character.theme.tint }}>
        <div className="workspace-wrap">
          <div className="workspace">
            <SVGColoringArtwork art={character.art} fills={doc.fills} layer="fills" />
            <ColoringCanvas art={character.art} strokes={doc.strokes} tool={tool} color={color} brushSize={size} onCommit={commit} />
            <SVGColoringArtwork art={character.art} layer="lines" />
          </div>
        </div>

        <div className="studio">
          <DrawingToolbar
            tool={tool}
            onTool={(t) => {
              setTool(t);
              sfx('tap');
            }}
            color={color}
            size={size}
            onSize={setSize}
            canUndo={session.past.length > 0}
            canRedo={session.future.length > 0}
            onUndo={() => dispatchSession({ type: 'undo', id: character.id })}
            onRedo={() => dispatchSession({ type: 'redo', id: character.id })}
            onClear={() => setConfirmClear(true)}
          />
          <ColorPalette value={color} onChange={pickColor} />
          <div className="finish-row">
            <Button variant="soft" size="lg" icon="save" onClick={() => save()}>
              Save
            </Button>
            <Button variant="primary" size="lg" icon="check" onClick={done}>
              Done Coloring!
            </Button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmClear}
        title="Start over?"
        message="This will clear your picture. You can still tap Undo afterwards."
        confirmLabel="Yes, clear it"
        danger
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          dispatchSession({ type: 'commit', id: character.id, patch: { clear: true } });
          setConfirmClear(false);
        }}
      />

      {celebrating && (
        <div className="celebrate" role="status" onClick={() => navigate(`/rhyme/${character.id}`)}>
          <Confetti />
          <div className="celebrate-card">
            <strong>Beautiful!</strong>
            <span>Now let’s sing!</span>
          </div>
        </div>
      )}
    </AppShell>
  );
}
