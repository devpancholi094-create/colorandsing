export default function Switch({ checked, onChange, label, hint }) {
  return (
    <div className="switch-row">
      <div>
        <div className="switch-label">{label}</div>
        {hint && <div className="switch-hint">{hint}</div>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)}>
        <span className="switch-knob" />
        <span className="switch-text">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
