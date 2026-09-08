import React, { useEffect, useState, useRef } from "react";
import { audioService } from "../../services/audioService";
import AuraCore from "../common/AuraCore";

const BOOT_SUBSYSTEMS = [
  { id: "core", label: "NEURAL COGNITIVE INTERFACE", detail: "Groq LLM Llama-3-70B • Multilingual Engine", threshold: 18 },
  { id: "risk", label: "HEURISTIC THREAT PROCESSOR", detail: "Algorithmic multi-vector risk synthesis", threshold: 38 },
  { id: "radar", label: "360° PERIMETER RADAR ARRAY", detail: "Continuous 3s listening daemon discovery", threshold: 58 },
  { id: "mitigation", label: "AUTONOMOUS COUNTERMEASURES", detail: "IPS firewall drop rules & kernel watchdog", threshold: 78 },
  { id: "biometrics", label: "BIOMETRIC SENTINEL SHIELD", detail: "Face landmark descriptors validated", threshold: 94 },
];

const KERNEL_MESSAGES = [
  "STAGE 01: [0x7FFE9B40] Allocating quantum virtual memory buffer...",
  "STAGE 02: [0x0040A180] Binding host socket telemetry via psutil...",
  "STAGE 03: [0x00F8C210] Establishing loopback isolation (127.0.0.1)...",
  "STAGE 04: [0x0119B020] Calibrating 360-degree radar frequency sweeps...",
  "STAGE 05: [0x028FA100] Loading heuristic vulnerability correlation matrices...",
  "STAGE 06: [0x0349E500] Initializing financial exposure loss model in INR (₹)...",
  "STAGE 07: [0x0400FA30] Spawning autonomous process termination watchdog...",
  "STAGE 08: [0x0599BB10] Validating SIH26105 defensive protocol integrity...",
  "STAGE 09: [0x0611CD20] Operators facial biometric verification: GRANTED.",
  "STAGE 10: [0x07EEFF00] ALL ENGINES NOMINAL. INITIALIZING COMMAND WORKSTATION.",
];

export default function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [activeLogs, setActiveLogs] = useState([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const logContainerRef = useRef(null);
  const lastAudioMilestone = useRef(0);

  useEffect(() => {
    // Initial sound effect
    audioService.playActivation();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinishing(true);
          audioService.playSuccess();
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
          return 100;
        }

        const next = prev + 1;

        // Sound milestones at subsystem thresholds
        if (next - lastAudioMilestone.current >= 20) {
          audioService.playClick();
          lastAudioMilestone.current = next;
        }

        // Add kernel logs sequentially as progress advances
        const logIndex = Math.floor((next / 100) * KERNEL_MESSAGES.length);
        if (logIndex > activeLogs.length && KERNEL_MESSAGES[logIndex - 1]) {
          setActiveLogs((curr) => [...curr, KERNEL_MESSAGES[logIndex - 1]]);
        }

        return next;
      });
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [activeLogs]);

  const handleBypass = () => {
    audioService.playCommand();
    setProgress(100);
    setIsFinishing(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div className={`boot-screen-holographic ${isFinishing ? "boot-finish-flash" : ""}`}>
      {/* Background Matrix & Sci-Fi HUD Scanline Grid */}
      <div className="boot-hud-overlay">
        <div className="boot-grid-bg"></div>
        <div className="boot-scanbeam"></div>

        {/* HUD Corner Reticles with Coordinate Telemetry */}
        <div className="boot-corner top-left">
          <span>SYS_LAT 28.6139° N</span>
        </div>
        <div className="boot-corner top-right">
          <span>HOST // DESKTOP-AURA</span>
        </div>
        <div className="boot-corner bottom-left">
          <span>SIH26105 // DEFENSE_CORE</span>
        </div>
        <div className="boot-corner bottom-right">
          <span>STATUS: ARMED</span>
        </div>
      </div>

      {/* Top Bar with Bypass Button */}
      <header className="boot-top-telemetry">
        <div className="boot-brand">
          <span className="boot-brand-pulse"></span>
          <strong>AURA SENTINEL DEFENSIVE SYSTEM</strong>
          <span className="boot-version">v0.1.0-ENTERPRISE.REV4</span>
        </div>

        <button className="boot-bypass-btn" onClick={handleBypass} title="Fast-Forward System Boot">
          <span>⚡</span> BYPASS INITIALIZATION →
        </button>
      </header>

      {/* Main Center Stage */}
      <main className="boot-matrix-stage">
        {/* Giant Holographic Arc Reactor Core */}
        <div className="boot-reactor-wrapper">
          {/* Animated concentric gyro rings */}
          <div className="boot-gyro-ring ring-outer"></div>
          <div className="boot-gyro-ring ring-middle"></div>
          <div className="boot-gyro-ring ring-inner"></div>

          <AuraCore state="PROCESSING" size={260} interactive={false} />

          <div className="boot-core-readout">
            <h1>AURA</h1>
            <span className="boot-readout-sub">SENTINEL OPERATING SYSTEM</span>
          </div>
        </div>

        {/* Dynamic Telemetry Status */}
        <div className="boot-hud-meter-wrap">
          <div className="boot-meter-top">
            <span className="boot-meter-label">
              {progress < 30
                ? "INITIALIZING QUANTUM NEURAL REGISTERS..."
                : progress < 60
                ? "CALIBRATING 360° LOCAL RADAR PERIMETER..."
                : progress < 90
                ? "ENFORCING AUTONOMOUS MITIGATION PIPELINE..."
                : "AURA CORE SYNCHRONIZATION COMPLETE"}
            </span>
            <strong className="boot-meter-percent">{progress}%</strong>
          </div>

          <div className="boot-meter-bar">
            <div className="boot-meter-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Dual HUD Diagnostic & Log Streams */}
        <div className="boot-telemetry-columns">
          {/* Left: Subsystems Status Checklist */}
          <div className="boot-subsystems-panel">
            <div className="boot-panel-title">
              <span className="panel-dot"></span>
              <h3>SUBSYSTEM DIAGNOSTICS</h3>
            </div>

            <div className="boot-subsystems-list">
              {BOOT_SUBSYSTEMS.map((sub) => {
                const isOnline = progress >= sub.threshold;
                const isCalibrating = !isOnline && progress >= sub.threshold - 15;

                return (
                  <div key={sub.id} className={`boot-sub-item ${isOnline ? "online" : isCalibrating ? "calibrating" : "standby"}`}>
                    <div className="boot-sub-indicator">
                      {isOnline ? "✓" : isCalibrating ? "◐" : "○"}
                    </div>
                    <div className="boot-sub-text">
                      <div className="boot-sub-label">
                        <strong>{sub.label}</strong>
                        <span className="sub-badge">
                          {isOnline ? "ONLINE" : isCalibrating ? "CALIBRATING..." : "STANDBY"}
                        </span>
                      </div>
                      <p>{sub.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Kernel Waterfall Terminal */}
          <div className="boot-terminal-panel">
            <div className="boot-panel-title">
              <span className="panel-dot green"></span>
              <h3>KERNEL MEMORY INITIALIZATION</h3>
            </div>

            <div className="boot-terminal-stream" ref={logContainerRef}>
              {activeLogs.map((log, index) => (
                <div key={index} className="boot-terminal-line">
                  <span className="term-prompt">›</span>
                  <span className="term-text">{log}</span>
                </div>
              ))}
              {progress < 100 && (
                <div className="boot-terminal-line blink">
                  <span className="term-prompt">›</span>
                  <span className="term-cursor">█</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="boot-bottom-strip">
        <span>SMART INDIA HACKATHON 2026 • SIH26105</span>
        <span>STANDALONE HARDWARE TELEMETRY & KERNEL SUPERVISOR</span>
        <span>AUTONOMOUS CYBER DEFENSE</span>
      </footer>
    </div>
  );
}
