import { useEffect, useMemo, useRef } from 'react';
import SVGColoringArtwork from './SVGColoringArtwork.jsx';
import { getRegionPaths, redrawAll } from '../utils/strokes.js';

/** Read-only picture of a colored drawing (used by My Creations and the home page). */
export default function ArtworkPreview({ character, doc }) {
  const canvasRef = useRef(null);
  const paths = useMemo(() => getRegionPaths(character.art), [character]);

  useEffect(() => {
    if (canvasRef.current) redrawAll(canvasRef.current, paths, doc.strokes);
  }, [doc.strokes, paths]);

  return (
    <div className="preview" style={{ '--tint': character.theme.tint }}>
      <SVGColoringArtwork art={character.art} fills={doc.fills} layer="fills" />
      <canvas ref={canvasRef} className="preview-canvas" width={360} height={360} aria-hidden="true" />
      <SVGColoringArtwork art={character.art} layer="lines" />
    </div>
  );
}
