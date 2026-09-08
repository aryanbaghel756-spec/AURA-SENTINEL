import React, { useState } from "react";
import { api } from "../../services/api";

export default function VisionIntelligence() {
  const [streamActive, setStreamActive] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const [key, setKey] = useState(0);

  const streamUrl = api.getVisionStreamUrl();

  const handleRefresh = () => {
    setStreamError(false);
    setStreamActive(true);
    setKey((prev) => prev + 1);
  };

  return (
    <main className="vision-dashboard">
      <div className="vision-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / COMPUTER VISION ENGINE</p>
          <h1>VISION INTELLIGENCE</h1>
          <p className="vision-description">
            Edge-accelerated neural object detection stream powered by YOLOv8n and OpenCV. Audits physical camera feeds for perimeter presence and unauthorized personnel in real time.
          </p>
        </div>

        <div className="live-status">
          <span className="pulse-indicator"></span>
          {streamActive && !streamError ? "NEURAL STREAM ACTIVE" : "STREAM PAUSED"}
        </div>
      </div>

      <div className="vision-stream-container">
        <div className="vision-stream-toolbar">
          <div className="toolbar-left">
            <span className="camera-label">SENSOR 01 (PRIMARY WEBCAM)</span>
            <span className="model-label">MODEL: YOLOv8n • CLASS: PERSON (0)</span>
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
                  ? "Ensure camera index 0 is not locked by another application and backend is active."
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

        <div className="vision-telemetry-strip">
          <div className="telemetry-item">
            <span>PIPELINE:</span>
            <strong>OPENCV V4L2 / DIRECTSHOW</strong>
          </div>
          <div className="telemetry-item">
            <span>INFERENCE:</span>
            <strong>ULTRALYTICS YOLOv8 TENSOR</strong>
          </div>
          <div className="telemetry-item">
            <span>LATENCY:</span>
            <strong>&lt; 35 MS (LOCAL HOST)</strong>
          </div>
          <div className="telemetry-item">
            <span>SECURITY LEVEL:</span>
            <strong className="level-nominal">CLASSIFIED MONITORING</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
