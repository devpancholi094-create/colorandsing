import Icon from './Icon.jsx';
import { BRUSH_SIZES } from '../data/palette.js';

const TOOLS = [
  { id: 'brush', label: 'Brush', icon: 'brush' },
  { id: 'fill', label: 'Fill', icon: 'bucket' },
  { id: 'eraser', label: 'Eraser', icon: 'eraser' },
];

const HINTS = {
  brush: 'Draw with your finger!',
  fill: 'Tap a shape to fill it!',
  eraser: 'Rub paint away, or tap a shape to clear it.',
};

export default function DrawingToolbar({ tool, onTool, color, size, onSize, canUndo, canRedo, onUndo, onRedo, onClear }) {
  return (
    <div className="toolbar">
      <div className="tool-status" aria-live="polite">
        <span className="now-color" style={{ background: tool === 'eraser' ? '#fff' : color }} aria-hidden="true" />
        <span className="now-text">
          <strong>{TOOLS.find((t) => t.id === tool).label}</strong>
          <small>{HINTS[tool]}</small>
        </span>
      </div>

      <div className="tool-row" role="radiogroup" aria-label="Tools">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={tool === t.id}
            className={`tool-btn ${tool === t.id ? 'is-active' : ''}`}
            onClick={() => onTool(t.id)}
          >
            <Icon name={t.icon} size={30} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="tool-row tool-row-small">
        <div className="sizes" role="radiogroup" aria-label="Brush size" aria-disabled={tool === 'fill'}>
          {BRUSH_SIZES.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="radio"
              aria-checked={size === s.value}
              aria-label={`${s.name} brush`}
              disabled={tool === 'fill'}
              className={`size-btn ${size === s.value ? 'is-active' : ''}`}
              onClick={() => onSize(s.value)}
            >
              <span className="size-dot" style={{ '--dot': `${10 + i * 8}px` }} />
            </button>
          ))}
        </div>
        <button type="button" className="mini-btn" onClick={onUndo} disabled={!canUndo}>
          <Icon name="undo" size={22} />
          <span>Undo</span>
        </button>
        <button type="button" className="mini-btn" onClick={onRedo} disabled={!canRedo}>
          <Icon name="redo" size={22} />
          <span>Redo</span>
        </button>
        <button type="button" className="mini-btn" onClick={onClear}>
          <Icon name="trash" size={22} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
