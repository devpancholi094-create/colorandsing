import { useEffect, useMemo, useRef } from 'react';
import { CANVAS_PX, VIEW } from '../config.js';
import { compactPoints, drawSegment, drawStroke, findRegionAt, getRegionPaths, redrawAll } from '../utils/strokes.js';

const TAP_DISTANCE = 6; // drawing units: smaller than this counts as a tap

/**
 * Freehand layer + pointer handling for ALL tools (brush, eraser, fill).
 * Pointer events cover touch, mouse and stylus. `touch-action: none` (in CSS) plus
 * preventDefault stops the page from scrolling while a child draws.
 * Calls onCommit(patch) once per finished action so undo/redo works per stroke / per fill.
 */
export default function ColoringCanvas({ art, strokes, tool, color, brushSize, onCommit }) {
  const canvasRef = useRef(null);
  const regionPaths = useMemo(() => getRegionPaths(art), [art]);
  const drawing = useRef(null);

  // Replay every stored stroke whenever the history changes (undo, redo, load, clear).
  useEffect(() => {
    if (canvasRef.current) redrawAll(canvasRef.current, regionPaths, strokes);
  }, [strokes, regionPaths]);

  const toUnits = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return [((clientX - rect.left) / rect.width) * VIEW, ((clientY - rect.top) / rect.height) * VIEW];
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (drawing.current) return; // ignore a second finger
    event.preventDefault();
    const [x, y] = toUnits(event.clientX, event.clientY);

    if (tool === 'fill') {
      const regionId = findRegionAt(art, x, y);
      if (regionId) onCommit({ fills: { [regionId]: color } }, regionId);
      return;
    }

    canvasRef.current.setPointerCapture?.(event.pointerId);
    const stroke = {
      tool,
      color: tool === 'eraser' ? '#000' : color,
      size: tool === 'eraser' ? Math.round(brushSize * 1.6) : brushSize,
      points: [[x, y]],
    };
    drawing.current = { pointerId: event.pointerId, stroke, start: [x, y], travelled: 0 };
    drawStroke(canvasRef.current, regionPaths, stroke);
  };

  const onPointerMove = (event) => {
    const current = drawing.current;
    if (!current || current.pointerId !== event.pointerId) return;
    event.preventDefault();
    const events = event.nativeEvent.getCoalescedEvents ? event.nativeEvent.getCoalescedEvents() : [];
    for (const e of events.length ? events : [event.nativeEvent]) {
      const [x, y] = toUnits(e.clientX, e.clientY);
      const last = current.stroke.points[current.stroke.points.length - 1];
      const distance = Math.hypot(x - last[0], y - last[1]);
      if (distance < 1.2) continue;
      current.stroke.points.push([x, y]);
      current.travelled += distance;
      drawSegment(canvasRef.current, regionPaths, current.stroke, last, [x, y]);
    }
  };

  const finish = (event) => {
    const current = drawing.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drawing.current = null;
    canvasRef.current.releasePointerCapture?.(event.pointerId);
    const stroke = { ...current.stroke, points: compactPoints(current.stroke.points) };
    if (stroke.tool === 'eraser' && current.travelled < TAP_DISTANCE) {
      // A tap with the eraser also turns the tapped color area white again.
      const regionId = findRegionAt(art, current.start[0], current.start[1]);
      onCommit({ stroke, fills: regionId ? { [regionId]: null } : undefined });
    } else {
      onCommit({ stroke });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`paint-canvas tool-${tool}`}
      width={CANVAS_PX}
      height={CANVAS_PX}
      role="img"
      aria-label={`Painting area. Use the ${tool} tool on the ${art.name || 'picture'}.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finish}
      onPointerCancel={finish}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
