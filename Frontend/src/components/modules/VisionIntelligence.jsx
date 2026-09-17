import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function VisionIntelligence() {
  const [streamActive, setStreamActive] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const [key, setKey] = useState(0);

  // Vision & Gesture Settings State
  const [settings, setSettings] = useState({
    auto_lock_enabled: true,
    grace_period_seconds: 5,
    gesture_control_enabled: true,
    is_locked: false,
    total_locks_triggered: 0,
    active_gesture: "NONE",
  });
  const [toastMessage, setToastMessage] = useState(null);

  const streamUrl = api.getVisionStreamUrl();

  const showNotification = (text, type = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSettings = async () => {
    try {
      const data = await api.getVisionSettings();
      if (data) {
        setSettings(data);
      }
    } catch {
      // Backend might be booting
    }
  };

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAutoLock = async () => {
    try {
      const newEnabled = !settings.auto_lock_enabled;
      await api.updateVisionSettings({ auto_lock_enabled: newEnabled });
      setSettings((prev) => ({ ...prev, auto_lock_enabled: newEnabled }));
      showNotification(
        newEnabled
          ? "🔒 Zero-Trust Auto-Lock ENABLED: System locks if you leave camera view!"
          : "🔓 Auto-Lock DISABLED: System will remain unlocked.",
        newEnabled ? "success" : "warning"
      );
    } catch {
      showNotification("Failed to update auto-lock setting.", "error");
    }
  };

  const handleGracePeriodChange = async (seconds) => {
    try {
      await api.updateVisionSettings({ grace_period_seconds: seconds });
      setSettings((prev) => ({ ...prev, grace_period_seconds: seconds }));
      showNotification(`⏱️ Disappearance Grace Period set to ${seconds} seconds.`, "info");
    } catch {
      showNotification("Failed to update grace period.", "error");
    }
  };

  const handleToggleGesture = async () => {
    try {
      const newEnabled = !settings.gesture_control_enabled;
      await api.updateVisionSettings({ gesture_control_enabled: newEnabled });
      setSettings((prev) => ({ ...prev, gesture_control_enabled: newEnabled }));
      showNotification(
        newEnabled
          ? "🖐️ Neural Hand Gestures ENGAGED (Volume, Window Jump, Pick & Drop)"
          : "✋ Hand Gestures PAUSED.",
        newEnabled ? "success" : "info"
      );
    } catch {
      showNotification("Failed to update gesture settings.", "error");
    }
  };

  const handleLockNow = async () => {
    try {
      showNotification("🚨 LOCKING WORKSTATION VIA ZERO-TRUST KERNEL...", "warning");
      await api.lockWorkstation();
    } catch {
      showNotification("Failed to trigger workstation lock.", "error");
    }
  };

  const handleRefresh = () => {
    setStreamError(false);
    setStreamActive(true);
    setKey((prev) => prev + 1);
  };

  return (
    <main className="vision-dashboard">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`blockchain-toast blockchain-toast-${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      {/* Header Section */}
      <div className="vision-title-section">
        <div>
          <p className="module-page-eyebrow">
            AURA SENTINEL / ZERO-TRUST PHYSICAL ACCESS & NEURAL GESTURE ENGINE
          </p>
          <h1>VISION INTELLIGENCE & GESTURE CONTROL</h1>
          <p className="vision-description">
            Continuous operator presence verification with instant <strong>Zero-Trust Auto-Lock</strong> on
            screen departure, coupled with a <strong>Neural Hand Gesture Engine</strong> for touchless OS
            control (volume adjustment, window jumping, and file drag & drop).
          </p>
        </div>

        <div className="live-status">
          <span
            className="pulse-indicator"
            style={{
              backgroundColor: settings.auto_lock_enabled ? "#00ff88" : "#ffaa00",
              boxShadow: settings.auto_lock_enabled ? "0 0 10px #00ff88" : "0 0 10px #ffaa00",
            }}
          ></span>
          {settings.auto_lock_enabled ? "ZERO-TRUST ACTIVE" : "AUTO-LOCK OFF"}
        </div>
      </div>

      {/* Interactive Control Deck */}
      <section className="vision-controls-grid">
        {/* Card 1: Zero-Trust Disappearance Auto-Lock */}
        <div className="vision-control-card">
          <div className="card-top">
            <span className="card-badge">ZERO-TRUST POLICY</span>
            <span className="card-icon">🔒</span>
          </div>
          <h3>PRESENCE AUTO-LOCK</h3>
          <p>
            When operator leaves the camera view, a warning countdown begins. If not back within the
            grace period, Windows immediately locks down.
          </p>

          <div className="control-row">
            <button
              className={`action-btn ${settings.auto_lock_enabled ? "restore-btn" : "tamper-btn"}`}
              onClick={handleToggleAutoLock}
            >
              {settings.auto_lock_enabled ? "✓ AUTO-LOCK ACTIVE" : "✕ AUTO-LOCK DISABLED"}
            </button>

            <button className="action-btn tamper-btn" onClick={handleLockNow} title="Lock now">
              🔐 LOCK WORKSTATION
            </button>
          </div>

          <div className="grace-selector">
            <span>GRACE PERIOD:</span>
            {[3, 5, 10, 15].map((sec) => (
              <button
                key={sec}
                className={`grace-pill ${settings.grace_period_seconds === sec ? "active" : ""}`}
                onClick={() => handleGracePeriodChange(sec)}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Card 2: Neural Hand Gesture Controller */}
        <div className="vision-control-card">
          <div className="card-top">
            <span className="card-badge">AI TOUCHLESS INPUT</span>
            <span className="card-icon">🖐️</span>
          </div>
          <h3>HAND GESTURE OS CONTROL</h3>
          <p>
            MediaPipe neural hand landmarking maps natural gestures to Windows system actions with zero
            touchscreen requirement.
          </p>

          <div className="control-row">
            <button
              className={`action-btn ${settings.gesture_control_enabled ? "restore-btn" : "tamper-btn"}`}
              onClick={handleToggleGesture}
            >
              {settings.gesture_control_enabled ? "✓ GESTURES ENABLED" : "✕ GESTURES PAUSED"}
            </button>

            <span className="gesture-status-pill">
              ACTIVE: <strong>{settings.active_gesture || "SEARCHING"}</strong>
            </span>
          </div>

          <div className="gesture-cheatsheet">
            <div className="gesture-item">
              <span className="gesture-icon">🤞</span>
              <span className="gesture-label">Cross Fingers: File Delete</span>
            </div>
            <div className="gesture-item">
              <span className="gesture-icon">☝️</span>
              <span className="gesture-label">Index Show: New Folder</span>
            </div>
            <div className="gesture-item">
              <span className="gesture-icon">🤏</span>
              <span className="gesture-label">Pinch Slide: Volume (+/-)</span>
            </div>
            <div className="gesture-item">
              <span className="gesture-icon">🖱️</span>
              <span className="gesture-label">Pinch & Move: Mouse Drag</span>
            </div>
            <div className="gesture-item">
              <span className="gesture-icon">✌️</span>
              <span className="gesture-label">Peace (V): Window Jump</span>
            </div>
            <div className="gesture-item">
              <span className="gesture-icon">📜</span>
              <span className="gesture-label">2-Fingers: Scroll Page</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stream Container */}
      <div className="vision-stream-container">
        <div className="vision-stream-toolbar">
          <div className="toolbar-left">
            <span className="camera-label">SENSOR 01 (PRIMARY WEBCAM)</span>
            <span className="model-label">
              YOLOv8 PERSON TRACKING + MEDIAPIPE HANDS + ZERO-TRUST KERNEL
            </span>
          </div>

          <div className="toolbar-actions">
            <button
              className="soc-btn-secondary small"
              onClick={() => setStreamActive(!streamActive)}
            >
              {streamActive ? "⏸ PAUSE FEED" : "▶ RESUME FEED"}
            </button>
            <button className="soc-btn-secondary small" onClick={handleRefresh}>
              ⟳ RECONNECT SENSOR
            </button>
          </div>
        </div>

        <div className="vision-feed-wrapper">
          {streamActive && !streamError ? (
            <img
              key={key}
              src={streamUrl}
              alt="Live AURA Neural Vision Stream"
              className="vision-feed"
              onError={() => setStreamError(true)}
            />
          ) : (
            <div className="vision-feed-placeholder">
              <div className="module-loader"></div>
              <h3>
                {streamError
                  ? "CAMERA SENSOR UNAVAILABLE OR PERMISSION BLOCKED"
                  : "STREAM FEED PAUSED BY OPERATOR"}
              </h3>
              <p>
                {streamError
                  ? "Ensure camera index 0 is connected and not locked by another application."
                  : "Click 'Resume Feed' above to re-engage YOLO real-time inference."}
              </p>
              {streamError && (
                <button className="soc-btn-primary small" onClick={handleRefresh}>
                  RETRY SENSOR CONNECTION
                </button>
              )}
            </div>
          )}

          {/* Cyber HUD Overlays */}
          <div className="vision-hud-overlay">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            <div className="hud-scanline"></div>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="vision-telemetry-strip">
          <div className="telemetry-item">
            <span>PRESENCE STATUS:</span>
            <strong style={{ color: "#00ff88" }}>CONTINUOUS AUDIT</strong>
          </div>
          <div className="telemetry-item">
            <span>AUTO-LOCK TRIGGERED:</span>
            <strong>{settings.total_locks_triggered} TIMES</strong>
          </div>
          <div className="telemetry-item">
            <span>INFERENCE:</span>
            <strong>YOLOv8 + MEDIAPIPE HANDS</strong>
          </div>
          <div className="telemetry-item">
            <span>LATENCY:</span>
            <strong>&lt; 30 MS (EDGE HARDWARE)</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
