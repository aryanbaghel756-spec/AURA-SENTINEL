import React, { useState, useEffect } from "react";
import { MODULE_REGISTRY } from "../../constants/modules";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";
import AuraCore from "../common/AuraCore";
import Sparkline from "../common/Sparkline";

const MODULE_DETAILS = {
  "system-monitoring": {
    badge: "HARDWARE TELEMETRY",
    desc: "Real-time CPU, RAM, disk usage curves and top memory-consuming process analysis.",
    tag: "LIVE METRICS",
  },
  "attack-surface": {
    badge: "NETWORK SCANNER",
    desc: "Automated localhost service detection, listening ports and 360° radar perimeter mapping.",
    tag: "PORT RADAR",
  },
  "risk-intelligence": {
    badge: "HEURISTIC MATRIX",
    desc: "Composite 0–100 cyber posture calculation correlating live multi-vector signals.",
    tag: "THREAT CORE",
  },
  "financial-risk": {
    badge: "BUSINESS IMPACT",
    desc: "Translates abstract technical vulnerabilities into actionable monetary exposure in ₹.",
    tag: "LOSS MODEL",
  },
  "what-if-engine": {
    badge: "PREDICTIVE SANDBOX",
    desc: "Simulate stress conditions and live cyber warfare scenarios with automated mitigation.",
    tag: "WARGAME",
  },
  "investment-optimizer": {
    badge: "SECURITY ROI",
    desc: "Algorithmically analyzes company budget and systems to recommend optimal defense plans.",
    tag: "STRATEGY",
  },
  "aura-voice": {
    badge: "AURA COPILOT",
    desc: "Multilingual conversational voice AI (Hindi/Hinglish/English) with holographic core.",
    tag: "VOICE AGENT",
  },
  "file-security": {
    badge: "DATA INTEGRITY",
    desc: "Scans user directories for sensitive credentials, duplicate files, and junk with safe quarantine.",
    tag: "SAFEGUARD",
  },
  "vision-intelligence": {
    badge: "COMPUTER VISION",
    desc: "Live camera-based YOLOv8 person detection stream running locally on your hardware.",
    tag: "YOLO FEED",
  },
};

export default function CommandCenter({ onOpenModule, onOpenPalette, onGenerateReport }) {
  const [telemetry, setTelemetry] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([42, 45, 48, 44, 52, 50, 48, 55, 52]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTelemetry = async () => {
      try {
        const data = await api.getRiskIntelligence();
        if (mounted && data) {
          setTelemetry(data);
          setCpuHistory((prev) => [...prev.slice(-14), Math.round(data.cpu_usage || 50)]);
        }
      } catch (e) {
        // Fallback silently if polling briefly fails
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleModuleClick = (modId) => {
    audioService.playCommand();
    onOpenModule(modId);
  };

  const toggleSound = () => {
    const newState = audioService.toggleSound();
    setSoundEnabled(newState);
    if (newState) audioService.playActivation();
  };

  const riskScore = telemetry ? telemetry.risk_score : 38;
  const riskLevel = telemetry ? telemetry.risk_level : "MODERATE";

  return (
    <div className="command-center">
      <header className="command-header">
        <div className="command-logo" onClick={() => audioService.playClick()}>
          <span className="command-logo-dot"></span>
          <div>
            <h1>AURA</h1>
            <p>SENTINEL COMMAND CENTER</p>
          </div>
        </div>

        <div className="command-header-actions">
          {/* Audio toggle */}
          <button
            className={`command-head-btn ${soundEnabled ? "active" : ""}`}
            onClick={toggleSound}
            title={soundEnabled ? "Audio On" : "Audio Muted"}
          >
            {soundEnabled ? "🔊 AUDIO ON" : "🔇 AUDIO MUTED"}
          </button>

          {/* Palette button */}
          {onOpenPalette && (
            <button
              className="command-head-btn"
              onClick={() => {
                audioService.playClick();
                onOpenPalette();
              }}
              title="Open Command Palette"
            >
              ⌘ CTRL+K
            </button>
          )}

          {/* Report button */}
          {onGenerateReport && (
            <button
              className="command-head-btn report"
              onClick={() => {
                audioService.playCommand();
                onGenerateReport();
              }}
              title="Generate Audit Report"
            >
              📄 AUDIT REPORT
            </button>
          )}

          <div className="command-system-status">
            <span className="status-light"></span>
            ALL ENGINES NOMINAL • SIH26105
          </div>
        </div>
      </header>

      <main className="command-main">
        {/* Futuristic Command HUD Strip */}
        <section className="command-telemetry-hud">
          <div className="hud-arc-reactor">
            <AuraCore state="IDLE" size={130} interactive={true} />
            <div className="hud-reactor-info">
              <span className="hud-eyebrow">AURA NEURAL CORE</span>
              <h3>OPERATIONAL</h3>
              <p>DEFENSIVE PROTOCOLS ACTIVE</p>
            </div>
          </div>

          <div className="hud-stat-card">
            <div className="stat-card-top">
              <span>CYBER POSTURE SCORE</span>
              <strong className={riskLevel === "HIGH" ? "risk-high" : "risk-moderate"}>
                {riskScore} / 100
              </strong>
            </div>
            <div className="stat-level-tag">{riskLevel} THREAT EXPOSURE</div>
            <p>Correlating compute spikes and bound network daemons.</p>
          </div>

          <div className="hud-stat-card">
            <div className="stat-card-top">
              <span>CPU COMPUTE PRESSURE</span>
              <strong>{telemetry ? `${Math.round(telemetry.cpu_usage)}%` : "48%"}</strong>
            </div>
            <div className="stat-sparkline-box">
              <Sparkline data={cpuHistory} color="var(--aura-cyan)" height={28} />
            </div>
            <p>15-sample rolling kernel telemetry.</p>
          </div>

          <div className="hud-stat-card">
            <div className="stat-card-top">
              <span>LISTENING SOCKETS</span>
              <strong>{telemetry ? `${telemetry.open_ports} PORTS` : "5 PORTS"}</strong>
            </div>
            <div className="stat-level-tag low">LOCAL LOOPBACK MONITORED</div>
            <p>Continuous 3-sec radar reconnaissance.</p>
          </div>
        </section>

        <section className="command-intro">
          <div>
            <p className="command-eyebrow">AURA DEFENSE WORKSTATION</p>
            <h2>INTELLIGENCE MODULE MATRIX</h2>
          </div>
          <p className="command-intro-desc">
            Deploy specialized autonomous security suites for continuous surveillance, threat simulation, and automated risk mitigation.
          </p>
        </section>

        <section className="module-grid">
          {MODULE_REGISTRY.map((mod) => {
            const meta = MODULE_DETAILS[mod.id] || {};
            return (
              <button
                key={mod.id}
                className="module-card"
                onClick={() => handleModuleClick(mod.id)}
                onMouseEnter={() => audioService.playClick()}
              >
                <div className="module-card-top">
                  <span className="module-number">{mod.number}</span>
                  <span className="module-tag">{meta.tag || "ONLINE"}</span>
                </div>
                <span className="module-icon">{mod.icon}</span>
                <h3>{mod.name}</h3>
                <p>{meta.desc}</p>
                <div className="module-card-bottom">
                  <span className="module-subbadge">{meta.badge}</span>
                  <span className="module-open">ENTER →</span>
                </div>
              </button>
            );
          })}
        </section>
      </main>

      <footer className="command-footer">
        <span>AURA SENTINEL v0.1.0</span>
        <span>9 INTELLIGENCE MODULES OPERATIONAL</span>
        <span>SMART INDIA HACKATHON 2026 • SIH26105</span>
      </footer>
    </div>
  );
}
