import { FiX } from "react-icons/fi";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button type="button" onClick={onClose} className="modal__close" aria-label="Close">
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
