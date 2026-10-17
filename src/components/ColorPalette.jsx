import Icon from './Icon.jsx';
import { PALETTE } from '../data/palette.js';

export default function ColorPalette({ value, onChange }) {
  return (
    <div className="palette" role="radiogroup" aria-label="Colors">
      {PALETTE.map((swatch) => {
        const selected = swatch.value === value;
        return (
          <button
            key={swatch.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={swatch.name}
            title={swatch.name}
            className={`swatch ${selected ? 'is-selected' : ''}`}
            style={{ '--swatch': swatch.value }}
            onClick={() => onChange(swatch.value)}
          >
            {selected && <Icon name="check" size={22} />}
          </button>
        );
      })}
    </div>
  );
}
