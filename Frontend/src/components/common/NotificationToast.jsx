import React from "react";

export default function NotificationToast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return "🛡️";
      case "warning":
        return "⚠️";
      case "error":
        return "⛔";
      case "security":
        return "⚡";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="hud-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`hud-toast-item ${toast.type?.toLowerCase() || "info"}`}
        >
          <span className="toast-icon">{getIcon(toast.type)}</span>
          <div className="toast-content">
            <h4 className="toast-title">{toast.title || "AURA SYSTEM NOTICE"}</h4>
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
