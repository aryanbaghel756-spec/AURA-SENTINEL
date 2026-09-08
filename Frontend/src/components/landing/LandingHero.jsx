import React, { useState, useEffect } from "react";
import { audioService } from "../../services/audioService";
import AuraCore from "../common/AuraCore";
import AuraGlobe from "./AuraGlobe";

export default function LandingHero({
  onOpenFaceAuth,
  onOpenOperatorLogin,
  onGuestAccess,
  faceModelsLoaded,
  onGenerateReport,
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("reactor"); // "reactor" | "globe"

  // Subtle 3D tilt tracking mouse
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = (clientX - centerX) / 50;
    const y = (clientY - centerY) / 50;
    setMousePos({ x, y });
  };

  const toggleSound = () => {
    const enabled = audioService.toggleSound();
    setSoundEnabled(enabled);
    if (enabled) audioService.playActivation();
  };

  return (
    <div className="hero-wrapper" onMouseMove={handleMouseMove}>
      {/* Top Cyber Navigation Bar */}
      <header className="landing-top-nav">
        <div className="landing-brand" onClick={() => audioService.playClick()}>
          <span className="brand-reactor-dot"></span>
          <div className="brand-text">
            <strong>AURA SENTINEL</strong>
            <small>AUTONOMOUS CYBER DEFENSE // SIH26105</small>
          </div>
        </div>

        <nav className="landing-nav-links">
          <a
            href="#aura-pulse-strip"
            className="nav-link"
            onClick={() => audioService.playClick()}
          >
            TELEMETRY
          </a>
          <a
            href="#aura-pipeline"
            className="nav-link"
            onClick={() => audioService.playClick()}
          >
            PIPELINE
          </a>
          <a
            href="#aura-showcase"
            className="nav-link"
            onClick={() => audioService.playClick()}
          >
            9 ENGINES
          </a>
          {onGenerateReport && (
            <button
              className="nav-link-btn"
              onClick={() => {
                audioService.playCommand();
                onGenerateReport();
              }}
            >
              📄 AUDIT REPORT
            </button>
          )}
        </nav>

        <div className="landing-nav-actions">
          <button
            className={`sound-toggle-btn ${soundEnabled ? "active" : ""}`}
            onClick={toggleSound}
            title="Toggle Procedural Cyber Audio"
          >
            {soundEnabled ? "🔊 AUDIO FX: ON" : "🔇 AUDIO: MUTED"}
          </button>

          {onOpenOperatorLogin && (
            <button
              className="nav-link-btn"
              style={{ borderColor: "rgba(0, 240, 255, 0.4)", color: "#ffffff" }}
              onClick={() => {
                audioService.playCommand();
                onOpenOperatorLogin();
              }}
            >
              🔑 OPERATOR LOGIN
            </button>
          )}

          <button
            className="nav-enter-btn"
            onClick={() => {
              audioService.playCommand();
              onOpenFaceAuth();
            }}
          >
            INITIALIZE AURA →
          </button>
        </div>
      </header>

      {/* Main Hero Cockpit */}
      <main className="landing-hero-stage">
        {/* Glowing Tag Pill */}
        <div className="hero-eyebrow-pill">
          <span className="eyebrow-glow-dot"></span>
          <span>SMART INDIA HACKATHON 2026 // ADVANCED SOC DEFENSE PLATFORM</span>
        </div>

        {/* Hero Title with Cinematic Illumination */}
        <h1 className="hero-cyber-title">
          AUTONOMOUS CYBER COMMAND OS
          <span className="hero-title-highlight">
            POWERED BY ADVANCED NEURAL TELEMETRY
          </span>
        </h1>

        <p className="hero-cyber-description">
          Continuous multi-vector risk synthesis, 360° perimeter radar, live wargame attack mitigation,
          and a multilingual AI co-pilot—engineered for mission-critical enterprise defense.
        </p>

        {/* Centerpiece: Holographic HUD Cockpit Stage */}
        <div
          className="hero-cockpit-container"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
          }}
        >
          {/* View Switcher: Arc Reactor vs 3D Globe */}
          <div className="cockpit-mode-switch">
            <button
              className={`mode-btn ${activeTab === "reactor" ? "active" : ""}`}
              onClick={() => {
                audioService.playClick();
                setActiveTab("reactor");
              }}
            >
              ◈ ARC REACTOR CORE
            </button>
            <button
              className={`mode-btn ${activeTab === "globe" ? "active" : ""}`}
              onClick={() => {
                audioService.playClick();
                setActiveTab("globe");
              }}
            >
              🌐 GLOBAL WIREFRAME
            </button>
          </div>

          {/* Center Stage Element */}
          <div className="cockpit-centerpiece">
            {activeTab === "reactor" ? (
              <div className="reactor-hero-stage">
                <AuraCore state="PROCESSING" size={280} interactive={true} />
                <div className="reactor-hero-overlay-text">
                  <span>NEURAL CORE ONLINE</span>
                  <strong>AURA SENTINEL OS</strong>
                </div>
              </div>
            ) : (
              <div className="globe-hero-stage">
                <AuraGlobe />
                <div className="reactor-hero-overlay-text">
                  <span>3D THREAT TOPOLOGY</span>
                  <strong>GLOBAL DEFENSE MATRIX</strong>
                </div>
              </div>
            )}

            {/* Orbiting Telemetry HUD Card 1: Risk Engine */}
            <div className="floating-hud-card card-top-left">
              <div className="hud-card-header">
                <span className="hud-card-icon">⬡</span>
                <span className="hud-card-title">RISK POSTURE</span>
              </div>
              <div className="hud-card-val">
                <strong>38</strong>
                <span className="hud-badge-nominal">NOMINAL</span>
              </div>
              <p>Continuous heuristic multi-vector synthesis.</p>
            </div>

            {/* Orbiting Telemetry HUD Card 2: Radar Array */}
            <div className="floating-hud-card card-top-right">
              <div className="hud-card-header">
                <span className="hud-card-icon">◈</span>
                <span className="hud-card-title">360° RADAR</span>
              </div>
              <div className="hud-card-val">
                <strong>6</strong>
                <span className="hud-badge-cyan">LISTENING</span>
              </div>
              <p>Host sockets isolated on 127.0.0.1 loopback.</p>
            </div>

            {/* Orbiting Telemetry HUD Card 3: Autonomous Mitigation */}
            <div className="floating-hud-card card-bottom-left">
              <div className="hud-card-header">
                <span className="hud-card-icon">⚡</span>
                <span className="hud-card-title">ACTIVE MITIGATION</span>
              </div>
              <div className="hud-card-val">
                <strong>ARMED</strong>
                <span className="hud-badge-green">IPTABLES DROP</span>
              </div>
              <p>1-click wargame threat neutralization.</p>
            </div>

            {/* Orbiting Telemetry HUD Card 4: Groq Copilot */}
            <div className="floating-hud-card card-bottom-right">
              <div className="hud-card-header">
                <span className="hud-card-icon">🎙</span>
                <span className="hud-card-title">AURA AI COPILOT</span>
              </div>
              <div className="hud-card-val">
                <strong>ONLINE</strong>
                <span className="hud-badge-cyan">HINDI / ENG</span>
              </div>
              <p>Groq LLM voice & autonomous file ops.</p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Action Triggers */}
        <div className="hero-action-buttons">
          <button
            className="hero-primary-btn"
            onClick={() => {
              audioService.playActivation();
              onOpenFaceAuth();
            }}
            disabled={!faceModelsLoaded}
          >
            <span className="btn-glow-sweep"></span>
            <span className="btn-icon">👁</span>
            <span>{faceModelsLoaded ? "INITIALIZE AURA (BIOMETRICS)" : "CALIBRATING FACE SENSORS..."}</span>
            <span className="btn-arrow">→</span>
          </button>

          {onOpenOperatorLogin && (
            <button
              className="hero-secondary-btn"
              style={{ borderColor: "rgba(0, 240, 255, 0.45)", background: "rgba(0, 240, 255, 0.07)" }}
              onClick={() => {
                audioService.playCommand();
                onOpenOperatorLogin();
              }}
            >
              <span className="btn-icon">👤</span>
              <span>OPERATOR LOGIN / SIGN UP</span>
            </button>
          )}

          {onGuestAccess && (
            <button
              className="hero-tertiary-btn"
              onClick={() => {
                audioService.playCommand();
                onGuestAccess();
              }}
            >
              <span className="btn-icon">🔐</span>
              <span>PASSCODE OVERRIDE</span>
            </button>
          )}

          {onGenerateReport && (
            <button
              className="hero-tertiary-btn"
              onClick={() => {
                audioService.playCommand();
                onGenerateReport();
              }}
            >
              <span className="btn-icon">📄</span>
              <span>AUDIT REPORT</span>
            </button>
          )}
        </div>

        {/* Bottom Hardware Telemetry Strip */}
        <div className="hero-telemetry-strip">
          <div className="strip-item">
            <span>KERNEL TELEMETRY:</span>
            <strong>LOCAL-FIRST KERNEL HOOKS</strong>
          </div>
          <div className="strip-divider">|</div>
          <div className="strip-item">
            <span>UPTIME STABILITY:</span>
            <strong>123H 48M VERIFIED</strong>
          </div>
          <div className="strip-divider">|</div>
          <div className="strip-item">
            <span>PROCESSING THREADS:</span>
            <strong>28 LOGICAL CORES</strong>
          </div>
          <div className="strip-divider">|</div>
          <div className="strip-item">
            <span>SECURITY LEVEL:</span>
            <strong style={{ color: "var(--threat-nominal)" }}>SIH26105 COMPLIANT</strong>
          </div>
        </div>
      </main>
    </div>
  );
}
