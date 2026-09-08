import React from "react";

export default function ConfirmModal({
  isOpen,
  title = "SECURITY ACTION REQUIRED",
  message,
  confirmText = "CONFIRM ACTION",
  cancelText = "ABORT",
  isDestructive = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="soc-modal-overlay" onClick={onCancel}>
      <div
        className={`soc-modal-card ${isDestructive ? "destructive" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="soc-modal-header">
          <div className="soc-modal-badge">
            <span className="badge-dot"></span>
            <span>AURA PROTOCOL CONFIRMATION</span>
          </div>
          <button className="soc-modal-close" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="soc-modal-body">
          <div className="soc-modal-icon">
            {isDestructive ? "⚠️" : "🛡️"}
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        <div className="soc-modal-footer">
          <button className="soc-btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`soc-btn-primary ${isDestructive ? "destructive" : ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
