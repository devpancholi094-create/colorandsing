import { useEffect, useId, useRef } from 'react';
import Button from './Button.jsx';

/** Modal confirm. Focus starts on the safe (cancel) button; Escape or the backdrop cancels. */
export default function ConfirmationDialog({ open, title, message, confirmLabel, cancelLabel = 'No, keep it', danger = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId} onClick={(e) => e.stopPropagation()}>
        <h2 id={titleId}>{title}</h2>
        {message && <p>{message}</p>}
        <div className="dialog-actions">
          <Button ref={cancelRef} variant="mint" size="lg" icon="x" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} size="lg" icon={danger ? 'trash' : 'check'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
