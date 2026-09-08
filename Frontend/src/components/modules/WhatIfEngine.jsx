import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";

const ATTACK_VECTORS = {
  brute_force: {
    id: "brute_force",
    title: "SSH / RDP BRUTE FORCE STORM",
    desc: "High-frequency dictionary and credential stuffing attempts targeting remote management ports.",
    attacker: "185.220.101.5 [TOR EXIT NODE: AMSTERDAM]",
    target: "PORT 22 / 3389 (OPEN SSH/RDP DAEMON)",
    packetsPerSec: "840 req/s",
    simulatedScore: 94,
    logs: [
      "[WARN] Multiple failed root auth attempts from 185.220.101.5",
      "[ALERT] Dictionary attack pattern recognized (pattern: rockyou.txt subhash)",
      "[CRITICAL] 420 auth failures in 3.2s on port 22",
      "[ALERT] RDP port 3389 probed for BlueKeep vulnerability",
    ],
  },
  ddos: {
    id: "ddos",
    title: "DISTRIBUTED SYN FLOOD (DDoS)",
    desc: "Volumetric network saturation flooding TCP handshake queues and starving legitimate connections.",
    attacker: "BOTNET SWARM [~2,410 REFLECTOR NODES]",
    target: "HTTP/HTTPS KERNEL SOCKETS (PORTS 80/443)",
    packetsPerSec: "128,000 pps",
    simulatedScore: 98,
    logs: [
      "[CRITICAL] Ingress packet rate spiked 4,800% above 5-min baseline",
      "[ALERT] SYN queue backlog reaching 98% saturation",
      "[ALERT] CPU softirq thread utilization: 92%",
      "[WARN] TCP window exhaustion detected across active worker sockets",
    ],
  },
  port_scan: {
    id: "port_scan",
    title: "AGGRESSIVE RECONNAISSANCE SCAN",
    desc: "Automated nmap/masscan probe cataloging listening banners, vulnerabilities, and daemons.",
    attacker: "45.154.255.88 [SCANNER DAEMON]",
    target: "PORTS 1 - 65535 [FULL RANGE TCP PROBE]",
    packetsPerSec: "4,200 pps",
    simulatedScore: 78,
    logs: [
      "[WARN] Rapid TCP SYN sequence sweeping ports 1024-5000",
      "[ALERT] Fingerprinting probe detected against local FastAPI port 8000",
      "[WARN] NULL scan packet sequence received from 45.154.255.88",
      "[ALERT] High-speed port enumeration identified",
    ],
  },
};

export default function WhatIfEngine() {
  const [activeTab, setActiveTab] = useState("hypothetical"); // "hypothetical" | "wargame"

  // Hypothetical Tuning State
  const [simulation, setSimulation] = useState({
    cpu: 50,
    memory: 50,
    disk: 50,
    ports: 5,
  });
  const [liveSnapshot, setLiveSnapshot] = useState(null);
  const [importStatus, setImportStatus] = useState("");

  // Wargame / Attack Simulation State
  const [selectedVector, setSelectedVector] = useState("brute_force");
  const [attackActive, setAttackActive] = useState(false);
  const [attackLogs, setAttackLogs] = useState([]);
  const [mitigated, setMitigated] = useState(false);
  const [mitigationMessage, setMitigationMessage] = useState("");
  const logFeedRef = useRef(null);

  useEffect(() => {
    if (logFeedRef.current) {
      logFeedRef.current.scrollTop = logFeedRef.current.scrollHeight;
    }
  }, [attackLogs]);

  const calculateSimulatedRisk = () => {
    let score = 0;
    if (simulation.cpu > 90) score += 25;
    else if (simulation.cpu > 75) score += 15;
    else if (simulation.cpu > 60) score += 8;

    if (simulation.memory > 90) score += 25;
    else if (simulation.memory > 80) score += 15;
    else if (simulation.memory > 70) score += 8;

    if (simulation.disk > 95) score += 20;
    else if (simulation.disk > 85) score += 12;
    else if (simulation.disk > 75) score += 6;

    if (simulation.ports > 15) score += 30;
    else if (simulation.ports > 8) score += 20;
    else if (simulation.ports > 3) score += 10;

    return Math.min(score, 100);
  };

  const importCurrentSystem = async () => {
    try {
      audioService.playClick();
      setImportStatus("SYNCHRONIZING...");
      const data = await api.getRiskIntelligence();
      const snap = {
        cpu: Math.round(data.cpu_usage),
        memory: Math.round(data.memory_usage),
        disk: Math.round(data.disk_usage),
        ports: Math.min(data.open_ports, 30),
      };
      setSimulation(snap);
      setLiveSnapshot(snap);
      setImportStatus("LIVE SYNCED");
      audioService.playSuccess();
      setTimeout(() => setImportStatus(""), 3000);
    } catch {
      setImportStatus("SYNC FAILED");
      setTimeout(() => setImportStatus(""), 3000);
    }
  };

  const loadScenario = (scenario) => {
    audioService.playClick();
    if (scenario === "normal") {
      setSimulation({ cpu: 25, memory: 40, disk: 50, ports: 2 });
    } else if (scenario === "heavy") {
      setSimulation({ cpu: 85, memory: 88, disk: 75, ports: 4 });
    } else if (scenario === "exposure") {
      setSimulation({ cpu: 65, memory: 70, disk: 85, ports: 18 });
    } else if (scenario === "reset") {
      setSimulation({ cpu: 50, memory: 50, disk: 50, ports: 5 });
    }
  };

  // Launch Live Attack Simulation
  const handleLaunchAttack = async () => {
    const vector = ATTACK_VECTORS[selectedVector];
    audioService.playAlert();
    setAttackActive(true);
    setMitigated(false);
    setMitigationMessage("");

    // Initialize attack logs with timestamp
    const now = new Date().toLocaleTimeString();
    setAttackLogs([
      `[${now}] === WARGAME SIMULATION INITIATED: ${vector.title} ===`,
      `[${now}] TARGETING: ${vector.target}`,
      `[${now}] SOURCE: ${vector.attacker}`,
      ...vector.logs.map((l) => `[${now}] ${l}`),
    ]);

    try {
      await api.simulateAttack(selectedVector);
    } catch (err) {
      console.warn("Backend attack simulation endpoint notice:", err);
    }
  };

  // Deploy Automated Countermeasures
  const handleDeployCountermeasures = async () => {
    audioService.playCommand();
    const vector = ATTACK_VECTORS[selectedVector];
    const now = new Date().toLocaleTimeString();

    const mitigationLogs = [
      `[${now}] === AURA SENTINEL ACTIVE MITIGATION ENGAGED ===`,
      `[${now}] [KERNEL FIREWALL] Added dynamic DROP rule for ${vector.attacker.split(" ")[0]}`,
      `[${now}] [TCP HARDENING] Enabled SYN cookies & adjusted tcp_max_syn_backlog to 4096`,
      `[${now}] [SOCKET SHIELD] Quarantined unauthorized connection bursts`,
      `[${now}] [STATUS] INTRUSION BLOCKED • RISK RESTORED TO NOMINAL`,
    ];

    setAttackLogs((prev) => [...prev, ...mitigationLogs]);
    setMitigated(true);
    setMitigationMessage("THREAT NEUTRALIZED BY AURA AUTOMATED DEFENSE PROTOCOL");
    audioService.playSuccess();

    try {
      await api.simulateAttack("clear");
    } catch (err) {
      console.warn("Backend clear notice:", err);
    }
  };

  const simulatedRisk = calculateSimulatedRisk();
  const simulatedLevel =
    simulatedRisk >= 60 ? "HIGH" : simulatedRisk >= 30 ? "MODERATE" : "LOW";

  const getRecommendations = () => {
    const recs = [];
    if (simulation.cpu > 75) {
      recs.push({
        level: "warning",
        title: "HIGH CPU LOAD PROJECTED",
        text: "Predicted CPU bottleneck. Implement autoscaling and profile runaway compute threads.",
      });
    }
    if (simulation.memory > 80) {
      recs.push({
        level: "warning",
        title: "MEMORY SATURATION RISK",
        text: "Approaching swap threshold. High probability of process eviction or OOM crashes.",
      });
    }
    if (simulation.disk > 85) {
      recs.push({
        level: "warning",
        title: "CRITICAL STORAGE RESTRICTION",
        text: "Low capacity will prevent write operations, crash database engines, and block updates.",
      });
    }
    if (simulation.ports > 8) {
      recs.push({
        level: "critical",
        title: "ELEVATED NETWORK ATTACK SURFACE",
        text: "Too many open sockets exposed. Restrict listening services using host-based firewalls.",
      });
    }
    if (recs.length === 0) {
      recs.push({
        level: "safe",
        title: "SYSTEM STABILITY PREDICTED",
        text: "The simulated parameters are well within safe enterprise operational margins.",
      });
    }
    return recs;
  };

  const recommendations = getRecommendations();

  return (
    <main className="whatif-dashboard">
      <div className="whatif-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / CYBER WARFARE SANDBOX</p>
          <h1>WHAT-IF & ATTACK SIMULATOR</h1>
          <p className="whatif-description">
            Hypothetical stress-tuning sandbox and live attack scenario generator. Test resilience, predict postures, and demonstrate active automated defense.
          </p>
        </div>

        {/* Tab Toggle: Hypothetical vs Wargame */}
        <div className="whatif-mode-tabs">
          <button
            className={`wargame-tab-btn ${activeTab === "hypothetical" ? "active" : ""}`}
            onClick={() => {
              audioService.playClick();
              setActiveTab("hypothetical");
            }}
          >
            HYPOTHETICAL TUNING
          </button>
          <button
            className={`wargame-tab-btn wargame ${activeTab === "wargame" ? "active" : ""}`}
            onClick={() => {
              audioService.playClick();
              setActiveTab("wargame");
            }}
          >
            <span className="live-pulse-dot"></span>
            LIVE ATTACK WARGAME (SIH DEMO)
          </button>
        </div>
      </div>

      {activeTab === "hypothetical" ? (
        <>
          <section className="whatif-grid">
            {/* Controls Column */}
            <div className="simulation-controls">
              <div className="simulation-header">
                <div>
                  <span className="process-eyebrow">HYPOTHETICAL TUNING</span>
                  <h2>MODIFY CONDITIONS</h2>
                </div>

                <button
                  className="import-system-btn"
                  onClick={importCurrentSystem}
                  disabled={importStatus === "SYNCHRONIZING..."}
                >
                  <span>⚡</span>
                  {importStatus || "IMPORT CURRENT SYSTEM"}
                </button>
              </div>

              <div className="scenario-presets">
                <span>QUICK PRESETS</span>
                <div className="preset-buttons">
                  <button onClick={() => loadScenario("normal")}>NOMINAL</button>
                  <button onClick={() => loadScenario("heavy")}>HEAVY LOAD</button>
                  <button onClick={() => loadScenario("exposure")}>HIGH EXPOSURE</button>
                  <button className="reset-scenario" onClick={() => loadScenario("reset")}>
                    ↺ DEFAULT
                  </button>
                </div>
              </div>

              {/* CPU Slider */}
              <div className="simulation-control">
                <div className="control-label">
                  <span>PROJECTED CPU LOAD</span>
                  <strong>{simulation.cpu}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulation.cpu}
                  onChange={(e) => setSimulation({ ...simulation, cpu: Number(e.target.value) })}
                />
              </div>

              {/* Memory Slider */}
              <div className="simulation-control">
                <div className="control-label">
                  <span>PROJECTED MEMORY USAGE</span>
                  <strong>{simulation.memory}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulation.memory}
                  onChange={(e) => setSimulation({ ...simulation, memory: Number(e.target.value) })}
                />
              </div>

              {/* Storage Slider */}
              <div className="simulation-control">
                <div className="control-label">
                  <span>PROJECTED STORAGE (C:\)</span>
                  <strong>{simulation.disk}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulation.disk}
                  onChange={(e) => setSimulation({ ...simulation, disk: Number(e.target.value) })}
                />
              </div>

              {/* Open Ports Slider */}
              <div className="simulation-control">
                <div className="control-label">
                  <span>OPEN LISTENING SOCKETS</span>
                  <strong>{simulation.ports} PORTS</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={simulation.ports}
                  onChange={(e) => setSimulation({ ...simulation, ports: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Prediction Result Column */}
            <div className="simulation-result">
              <span className="result-eyebrow">PROJECTED COMPOSITE SCORE</span>

              <div className="simulation-gauge" style={{ "--simulation-risk": simulatedRisk }}>
                <div className="simulation-gauge-inner">
                  <strong>{simulatedRisk}</strong>
                  <small>/ 100</small>
                </div>
              </div>

              <h2
                className={`result-level ${
                  simulatedLevel === "HIGH"
                    ? "risk-high"
                    : simulatedLevel === "MODERATE"
                    ? "risk-moderate"
                    : "risk-low"
                }`}
              >
                {simulatedLevel} RISK PREDICTED
              </h2>

              <p>
                Synthesized dynamically using the AURA algorithmic correlation engine based on your selected stress parameters.
              </p>

              {liveSnapshot && (
                <div className="delta-comparison">
                  <span>DELTA VS LIVE TELEMETRY</span>
                  <div className="delta-chips">
                    <div className="delta-chip">
                      <span>CPU:</span>
                      <strong>
                        {simulation.cpu - liveSnapshot.cpu >= 0
                          ? `+${simulation.cpu - liveSnapshot.cpu}%`
                          : `${simulation.cpu - liveSnapshot.cpu}%`}
                      </strong>
                    </div>
                    <div className="delta-chip">
                      <span>RAM:</span>
                      <strong>
                        {simulation.memory - liveSnapshot.memory >= 0
                          ? `+${simulation.memory - liveSnapshot.memory}%`
                          : `${simulation.memory - liveSnapshot.memory}%`}
                      </strong>
                    </div>
                    <div className="delta-chip">
                      <span>PORTS:</span>
                      <strong>
                        {simulation.ports - liveSnapshot.ports >= 0
                          ? `+${simulation.ports - liveSnapshot.ports}`
                          : `${simulation.ports - liveSnapshot.ports}`}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* AI Recommendations */}
          <section className="simulation-recommendations">
            <div className="recommendations-header">
              <div>
                <span className="process-eyebrow">AURA DECISION ENGINE</span>
                <h2>PREDICTIVE MITIGATION DIRECTIVES</h2>
              </div>
              <div className="recommendation-status">
                {recommendations.length} DIRECTIVE{recommendations.length !== 1 ? "S" : ""}
              </div>
            </div>

            <div className="recommendation-grid">
              {recommendations.map((rec, index) => (
                <article key={`${rec.title}-${index}`} className={`recommendation-card ${rec.level}`}>
                  <div className="recommendation-top">
                    <span className={`recommendation-indicator ${rec.level}`}></span>
                    <span className="recommendation-level">
                      {rec.level === "safe" ? "NOMINAL" : rec.level === "critical" ? "CRITICAL ALERT" : "WARNING"}
                    </span>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.text}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* LIVE ATTACK WARGAME (SIH DEMO MODE) */
        <section className="wargame-container">
          <div className="wargame-setup-card">
            <div className="wargame-header">
              <div>
                <span className="process-eyebrow">THREAT INJECTION LABORATORY</span>
                <h2>CHOOSE ATTACK SCENARIO</h2>
              </div>
              <span className="badge-demo">HACKATHON SHOWCASE READY</span>
            </div>

            <div className="vector-selection-grid">
              {Object.values(ATTACK_VECTORS).map((vec) => (
                <div
                  key={vec.id}
                  className={`vector-card ${selectedVector === vec.id ? "active" : ""}`}
                  onClick={() => {
                    audioService.playClick();
                    setSelectedVector(vec.id);
                  }}
                >
                  <div className="vector-card-header">
                    <span className="vector-badge">{vec.id.toUpperCase()}</span>
                    <span className="vector-pps">{vec.packetsPerSec}</span>
                  </div>
                  <h3>{vec.title}</h3>
                  <p>{vec.desc}</p>
                  <div className="vector-meta">
                    <div>
                      <span>TARGET:</span> <strong>{vec.target}</strong>
                    </div>
                    <div>
                      <span>THREAT SCORE:</span> <strong className="risk-high">{vec.simulatedScore}/100</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="wargame-actions-bar">
              <button
                className={`launch-attack-btn ${attackActive && !mitigated ? "attacking" : ""}`}
                onClick={handleLaunchAttack}
              >
                <span>🔥</span>
                {attackActive && !mitigated ? "ATTACK IN PROGRESS (RE-TRIGGER)" : "LAUNCH LIVE ATTACK SIMULATION"}
              </button>

              {attackActive && !mitigated && (
                <button className="mitigate-attack-btn" onClick={handleDeployCountermeasures}>
                  <span>🛡️</span>
                  DEPLOY SENTINEL COUNTERMEASURES
                </button>
              )}
            </div>
          </div>

          {/* Real-time Attack HUD / Telemetry Stream */}
          {attackActive && (
            <div className={`attack-telemetry-panel ${mitigated ? "mitigated" : "under-attack"}`}>
              <div className="telemetry-panel-top">
                <div className="attack-status-indicator">
                  <span className={`status-lamp ${mitigated ? "green" : "red-flashing"}`}></span>
                  <strong>
                    {mitigated
                      ? "THREAT NEUTRALIZED • PERIMETER RESTORED"
                      : "CRITICAL ASSAULT IN PROGRESS"}
                  </strong>
                </div>

                <div className="attacker-info-tag">
                  ATTACKER: <strong>{ATTACK_VECTORS[selectedVector].attacker}</strong>
                </div>
              </div>

              {mitigationMessage && (
                <div className="mitigation-banner">
                  <span>✓</span> {mitigationMessage}
                </div>
              )}

              <div className="terminal-log-feed" ref={logFeedRef}>
                <div className="terminal-header">
                  <span>AURA SENTINEL IDS/IPS LOG STREAM</span>
                  <span>ACTIVE FEED</span>
                </div>
                {attackLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`terminal-line ${
                      log.includes("CRITICAL")
                        ? "log-critical"
                        : log.includes("WARN")
                        ? "log-warn"
                        : log.includes("STATUS") || log.includes("FIREWALL")
                        ? "log-success"
                        : ""
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
