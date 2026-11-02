'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

// Custom modal dialog (browser alert/confirm bebohar kora jabe na)
export default function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={e => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`modal ${wide ? 'modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button
            type="button"
            className="modal-x"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
