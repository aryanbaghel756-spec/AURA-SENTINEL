import React from "react";

export default function AuraCore({
  state = "IDLE", // IDLE | LISTENING | THINKING | PROCESSING | SPEAKING | ATTACK | ERROR | OFFLINE
  size = 220,
  onClick,
  showLabel = true,
}) {
  const normalizedState = state.toUpperCase();

  const getStateColor = () => {
    switch (normalizedState) {
      case "LISTENING":
        return "#00f0ff";
      case "THINKING":
      case "PROCESSING":
        return "#ffaa00";
      case "SPEAKING":
        return "#0b8cff";
      case "ATTACK":
      case "ERROR":
        return "#ff2a55";
      case "OFFLINE":
        return "#5a6b82";
      case "IDLE":
      default:
        return "#00f0ff";
    }
  };

  const currentColor = getStateColor();

  return (
    <div
      className={`aura-arc-reactor ${normalizedState.toLowerCase()}`}
      style={{
        width: size,
        height: size,
        "--core-color": currentColor,
      }}
      onClick={onClick}
      title={`AURA CORE: ${normalizedState}`}
    >
      {/* Outer Holographic Bracket Ring */}
      <div className="reactor-bracket-ring ring-outer"></div>

      {/* Segmented Arc Rings */}
      <div className="reactor-segmented-ring ring-cw">
        <span className="arc-seg seg-1"></span>
        <span className="arc-seg seg-2"></span>
        <span className="arc-seg seg-3"></span>
      </div>

      <div className="reactor-segmented-ring ring-ccw">
        <span className="arc-seg-inner seg-a"></span>
        <span className="arc-seg-inner seg-b"></span>
      </div>

      {/* Pulsing Energy Waves (Listening/Speaking) */}
      {(normalizedState === "LISTENING" || normalizedState === "SPEAKING") && (
        <>
          <div className="reactor-wave-echo echo-1"></div>
          <div className="reactor-wave-echo echo-2"></div>
        </>
      )}

      {/* Core Center Reactor Glass */}
      <div className="reactor-core-center">
        <div className="core-iris">
          <div className="core-symbol">
            {normalizedState === "ATTACK" || normalizedState === "ERROR" ? (
              <span className="core-alert-glyph">⚠</span>
            ) : normalizedState === "LISTENING" ? (
              <span className="core-mic-glyph">🎙</span>
            ) : normalizedState === "SPEAKING" ? (
              <span className="core-wave-glyph">≋</span>
            ) : (
              <span className="core-aura-glyph">AURA</span>
            )}
          </div>
        </div>
      </div>

      {showLabel && (
        <div className="core-status-pill">
          <span className="core-dot"></span>
          <span className="core-state-text">{normalizedState}</span>
        </div>
      )}
    </div>
  );
}
