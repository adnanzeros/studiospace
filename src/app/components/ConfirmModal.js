'use client';

import Modal from './Modal';

// Delete / Cancel er age confirmation dialog
export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Keep it',
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal title={title} onClose={busy ? undefined : onClose}>
      <p className="modal-text">{message}</p>
      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onClose}
          disabled={busy}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Please wait...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
