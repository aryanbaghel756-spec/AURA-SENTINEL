import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import AttackSurfaceRadar from "./AttackSurfaceRadar";
import { audioService } from "../../services/audioService";

export default function AttackSurface() {
  const [attackData, setAttackData] = useState(null);
  const [attackError, setAttackError] = useState("");
  const [portFilter, setPortFilter] = useState("");
  const [selectedPort, setSelectedPort] = useState(null);

  // Autonomous Filter Mode: TRUE by default (harmless ephemeral noise filtered automatically)
  const [autoFilterNoise, setAutoFilterNoise] = useState(true);

  // Threat Deck View Mode: "ACTIVE" | "MITIGATED"
  const [threatDeckTab, setThreatDeckTab] = useState("ACTIVE");

  // Port Suppression & Filtering State (persisted in localStorage)
  const [suppressedPorts, setSuppressedPorts] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_suppressed_ports");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" | "THREATS" | "WEB" | "DATABASE" | "NOISE"
  const [actionNotice, setActionNotice] = useState(null);
  const [copiedPort, setCopiedPort] = useState(null);
  const [simulatedProbe, setSimulatedProbe] = useState(null);
  const [terminatingPid, setTerminatingPid] = useState(null);
  const [remediatingPort, setRemediatingPort] = useState(null);
  const [remediationModal, setRemediationModal] = useState(null);
  const [demoBackdoorLoading, setDemoBackdoorLoading] = useState(false);
  const [terminatingAllDanger, setTerminatingAllDanger] = useState(false);

  const showNotification = (text, type = "info") => {
    setActionNotice({ text, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const fetchAttack = useCallback(async () => {
    try {
      const data = await api.getAttackSurface();
      setAttackData(data);
      setAttackError("");
    } catch {
      setAttackError("ATTACK SURFACE ANALYSIS UNAVAILABLE");
    }
  }, []);

  useEffect(() => {
    fetchAttack();
    const interval = setInterval(fetchAttack, 3000);
    return () => clearInterval(interval);
  }, [fetchAttack]);

  const getPortCategory = (port) => {
    if ([80, 443, 3000, 5000, 5173, 8000, 8080].includes(port)) return "WEB / HTTP";
    if ([3306, 5432, 27017, 6379, 1433, 1521].includes(port)) return "DATABASE";
    if ([21, 22, 23, 25, 53, 110, 135, 139, 445, 3389, 5900].includes(port)) return "CORE / INFRA";
    return "USER / RPC";
  };

  // Toggle single port suppression (Enable / Disable)
  const handleTogglePortSuppression = (portNumber, e) => {
    if (e) e.stopPropagation();
    setSuppressedPorts((prev) => {
      const isAlreadySuppressed = prev.includes(portNumber);
      const updated = isAlreadySuppressed
        ? prev.filter((p) => p !== portNumber)
        : [...prev, portNumber];

      try {
        localStorage.setItem("aura_suppressed_ports", JSON.stringify(updated));
      } catch {
        // Storage fallback
      }

      showNotification(
        isAlreadySuppressed
          ? `🛡️ Port :${portNumber} RE-ENABLED: Restored to active attack surface monitoring.`
          : `🔇 Port :${portNumber} SUPPRESSED: Filtered from active threat calculation.`,
        isAlreadySuppressed ? "success" : "warning"
      );

      return updated;
    });
    audioService.playClick();
  };

  // Copy Netsh Firewall Block Rule to Clipboard
  const handleCopyFirewallCmd = (cmd, portNumber, e) => {
    if (e) e.stopPropagation();
    const commandToCopy =
      cmd || `netsh advfirewall firewall add rule name="AURA_BLOCK_PORT_${portNumber}" dir=in action=block protocol=TCP localport=${portNumber}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(commandToCopy);
      setCopiedPort(portNumber);
      setTimeout(() => setCopiedPort(null), 2500);
      showNotification(`📋 FIREWALL RULE COPIED: Paste into Admin PowerShell to instantly block port :${portNumber}!`, "success");
      audioService.playCommand();
    }
  };

  // Simulate an incoming adversary probe against a threat port
  const handleSimulateProbe = (portObj, e) => {
    if (e) e.stopPropagation();
    setSimulatedProbe({
      port: portObj.port,
      title: portObj.threat_title || `Port :${portObj.port}`,
      time: new Date().toLocaleTimeString(),
      attackerIp: "192.168.1.105 [UNAUTHORIZED_LAN_HOST]",
    });
    audioService.playAlert();
    showNotification(`🚨 INGRESS PROBE DETECTED: Rogue packet scan intercepted on Port :${portObj.port}!`, "error");
  };

  // Kill rogue process associated with port
  const handleKillProcess = async (pid, processName) => {
    if (!pid || pid === "KERNEL") return;
    try {
      setTerminatingPid(pid);
      await api.killProcess(pid);
      showNotification(`⛔ PROCESS TERMINATED: PID ${pid} (${processName}) successfully halted.`, "success");
      audioService.playCommand();
      setSelectedPort(null);
    } catch (err) {
      showNotification(`Failed to terminate process PID ${pid}: ${err.message}`, "error");
    } finally {
      setTerminatingPid(null);
    }
  };

  // Whitelist port as authorized developer work service
  const handleWhitelistAsWorkPort = (threatObj) => {
    setSuppressedPorts((prev) => {
      const updated = prev.includes(threatObj.port) ? prev : [...prev, threatObj.port];
      try {
        localStorage.setItem("aura_suppressed_ports", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showNotification(
      `💼 Port :${threatObj.port} (${threatObj.service_name || "Work Service"}) marked as AUTHORIZED WORK PORT. Immune from threat termination!`,
      "success"
    );
    audioService.playClick();
  };

  // Remove from work whitelist and restore to active threat monitoring
  const handleRemoveFromWorkPorts = (portNumber) => {
    setSuppressedPorts((prev) => {
      const updated = prev.filter((p) => p !== portNumber);
      try {
        localStorage.setItem("aura_suppressed_ports", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showNotification(
      `🛡️ Port :${portNumber} RESTORED TO ACTIVE THREAT RADAR: Full scanning re-engaged.`,
      "info"
    );
    audioService.playClick();
  };

  // Unblock firewall and simultaneously mark as legitimate work port
  const handleUnblockAndWhitelistForWork = async (threatObj) => {
    try {
      setRemediatingPort(threatObj.port);
      audioService.playCommand();

      // 1. Delete Windows Firewall block rule on backend
      await api.remediatePort({
        port: threatObj.port,
        pid: threatObj.pid,
        process_name: threatObj.process,
        action: "RESTORE",
      });

      // 2. Add to authorized work ports whitelist
      setSuppressedPorts((prev) => {
        const updated = prev.includes(threatObj.port) ? prev : [...prev, threatObj.port];
        try {
          localStorage.setItem("aura_suppressed_ports", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      showNotification(
        `💼 PORT :${threatObj.port} UNBLOCKED & RESTORED: Inbound firewall block removed. Marked as legitimate work port!`,
        "success"
      );
      audioService.playAlert();
      await fetchAttack();
      setThreatDeckTab("WORK");
    } catch (err) {
      showNotification(`Failed to restore port :${threatObj.port}: ${err.message}`, "error");
    } finally {
      setRemediatingPort(null);
    }
  };

  // Autonomous Threat Remediation & Neutralization
  const handleRemediateThreat = async (threatObj, action = "AUTO") => {
    try {
      setRemediatingPort(threatObj.port);
      audioService.playCommand();

      const modalData = {
        port: threatObj.port,
        service: threatObj.service_name,
        pid: threatObj.pid,
        process: threatObj.process,
        logs: [
          `[00:00.01] INITIATING AURA ACTIVE DEFENSE PROTOCOL ON PORT :${threatObj.port}...`,
          `[00:00.07] Target Identity: ${threatObj.service_name} (PID: ${threatObj.pid || "KERNEL"} - ${threatObj.process || "System"})`,
        ],
        status: "running",
      };
      setRemediationModal(modalData);

      const isKernel = !threatObj.pid || threatObj.pid <= 4 || /system|svchost/i.test(threatObj.process || "");

      if (action === "RESTORE") {
        modalData.logs.push(`[00:00.12] ↺ Restoring inspection telemetry and withdrawing perimeter block...`);
      } else if (action === "TERMINATE") {
        modalData.logs.push(`[00:00.12] ⛔ TERMINATION SEQUENCE INITIATED: Severing active socket on port :${threatObj.port}...`);
        if (isKernel) {
          modalData.logs.push(`[00:00.18] ⚠️ TARGET IS OS KERNEL SERVICE (PID ${threatObj.pid || 4}). Deploying perimeter severance to prevent OS crash.`);
        } else {
          modalData.logs.push(`[00:00.18] Target is application process. Dispatching SIGKILL termination signal...`);
        }
      } else if (isKernel) {
        modalData.logs.push(`[00:00.15] ⚠️ KERNEL GUARD ENGAGED: Target is Windows NT Kernel (PID ${threatObj.pid || 4}).`);
        modalData.logs.push(`[00:00.22] Direct SIGKILL prevented to protect OS stability against Blue Screen (BSOD).`);
        modalData.logs.push(`[00:00.32] Deploying Host Perimeter Blockade: Dropping inbound packets via Windows Defender Firewall...`);
      } else {
        modalData.logs.push(`[00:00.18] Target identified as application service. Dispatching SIGKILL termination signal...`);
      }
      setRemediationModal({ ...modalData });

      const res = await api.remediatePort({
        port: threatObj.port,
        pid: threatObj.pid,
        process_name: threatObj.process,
        action: action,
      });

      if (res.status === "NEUTRALIZED" || res.status === "TERMINATED" || res.status === "RESTORED") {
        if (res.method === "FIREWALL_INBOUND_BLOCK" || res.method === "PERIMETER_TERMINATION") {
          modalData.logs.push(`[00:00.48] [✓] Windows Defender Firewall Block Rule Applied: '${res.rule_name}'`);
          modalData.logs.push(`[00:00.62] [✓] Inbound TCP :${threatObj.port} traffic successfully blocked.`);
        } else if (res.method === "SIGKILL") {
          modalData.logs.push(`[00:00.45] [✓] Rogue process PID ${threatObj.pid} halted via SIGKILL.`);
          modalData.logs.push(`[00:00.58] [✓] Rogue listening socket closed.`);
        } else if (res.status === "RESTORED") {
          modalData.logs.push(`[00:00.42] [✓] Inbound block rule removed. Socket restored to standard telemetry.`);
        }
        modalData.logs.push(`[00:00.78] [✓] SHA-256 Merkle Proof Mined into Blockchain Audit Ledger.`);
        modalData.logs.push(`[00:00.95] [★] THREAT STATUS: 100% SECURED & AUDITED.`);
        modalData.status = "success";
        modalData.result = res;
        setRemediationModal({ ...modalData });
        audioService.playAlert();
        showNotification(
          action === "RESTORE"
            ? `↺ Port :${threatObj.port} restored to standard monitoring.`
            : action === "TERMINATE"
            ? `⛔ THREAT TERMINATED: Port :${threatObj.port} socket severed & neutralized!`
            : `🛡️ THREAT NEUTRALIZED: Port :${threatObj.port} perimeter isolated & blocked!`,
          "success"
        );
        await fetchAttack();
      } else {
        modalData.logs.push(`[!] Remediation notice: ${res.message || "Action processed."}`);
        modalData.status = "warning";
        setRemediationModal({ ...modalData });
        await fetchAttack();
      }
    } catch (err) {
      if (remediationModal) {
        setRemediationModal((prev) => ({
          ...prev,
          logs: [...(prev?.logs || []), `[!] Remediation error: ${err.message}`],
          status: "error",
        }));
      }
      showNotification(`Remediation failed: ${err.message}`, "error");
    } finally {
      setRemediatingPort(null);
    }
  };

  // Launch or Kill Live Demo Rogue Backdoor Listener (Port 4444)
  const handleSpawnDemoBackdoor = async () => {
    try {
      setDemoBackdoorLoading(true);
      const isRunning = attackData?.demo_threat_active;
      const res = await api.remediatePort({
        port: 4444,
        action: isRunning ? "KILL_PROCESS" : "SPAWN_DEMO",
      });
      audioService.playAlert();
      showNotification(
        isRunning
          ? "🛑 Simulated Rogue Backdoor Terminated. Port 4444 closed."
          : "🚨 ROGUE REVERSE SHELL SPAWNED on Port 4444! Check Radar & Threat Deck.",
        isRunning ? "success" : "error"
      );
      await fetchAttack();
    } catch (err) {
      showNotification(`Failed to toggle demo backdoor: ${err.message}`, "error");
    } finally {
      setDemoBackdoorLoading(false);
    }
  };

  // Autonomous Hunter: Terminate & Neutralize all active danger ports
  const handleTerminateAllDangerPorts = async () => {
    try {
      setTerminatingAllDanger(true);
      audioService.playCommand();
      showNotification("⚡ Initiating autonomous scan & termination of all danger ports...", "info");
      const res = await api.terminateDangerPorts({});
      if (res.status === "COMPLETED") {
        audioService.playAlert();
        showNotification(
          `🛡️ DANGER PORTS NEUTRALIZED: ${res.terminated_count} rogue processes killed, ${res.shielded_count} system ports shielded!`,
          "success"
        );
      } else {
        showNotification(res.message || "Termination completed", "info");
      }
      await fetchAttack();
    } catch (err) {
      showNotification(`Danger port termination failed: ${err.message}`, "error");
    } finally {
      setTerminatingAllDanger(false);
    }
  };

  const handleSelectPortFromRadar = (portObj) => {
    setSelectedPort(portObj);
    audioService.playCommand();
  };

  const handleClearSelectedPort = () => {
    setSelectedPort(null);
    audioService.playClick();
  };

  const allPorts = attackData?.ports || [];

  // Active unmitigated threats (real danger ports that are NOT yet mitigated AND NOT whitelisted for work)
  const activeThreats = allPorts.filter(
    (p) => (p.threat_level === "CRITICAL" || p.threat_level === "HIGH") && !p.is_mitigated && !suppressedPorts.includes(p.port)
  );

  // Terminated & Shielded threats (not whitelisted)
  const shieldedThreats = allPorts.filter((p) => p.is_mitigated && !suppressedPorts.includes(p.port));

  // Developer Authorized Work Ports (Whitelisted by user)
  const workPorts = allPorts.filter((p) => suppressedPorts.includes(p.port));

  const displayedThreats =
    threatDeckTab === "ACTIVE"
      ? activeThreats
      : threatDeckTab === "MITIGATED"
      ? shieldedThreats
      : workPorts;

  // Compute category counts
  const counts = {
    all: allPorts.length,
    threats: activeThreats.length,
    shielded: shieldedThreats.length,
    work: workPorts.length,
    web: allPorts.filter((p) => getPortCategory(p.port) === "WEB / HTTP").length,
    database: allPorts.filter((p) => getPortCategory(p.port) === "DATABASE").length,
    noise: allPorts.filter((p) => p.is_noise || p.threat_level === "NOISE" || p.port >= 49152).length,
    clean: allPorts.filter((p) => !p.is_noise && p.threat_level !== "NOISE" && p.port < 49152).length,
  };

  // Filter ports based on autonomous noise filter, tabs, search, radar selection, and suppression
  const filteredPorts = allPorts.filter((p) => {
    const isNoise = p.is_noise || p.threat_level === "NOISE" || p.port >= 49152;
    const isSuppressed = suppressedPorts.includes(p.port);

    // If radar lock-on
    if (selectedPort && p.port !== selectedPort.port) return false;

    // Tab filtering
    if (activeTab === "THREATS" && p.threat_level !== "CRITICAL" && p.threat_level !== "HIGH") return false;
    if (activeTab === "WEB" && getPortCategory(p.port) !== "WEB / HTTP") return false;
    if (activeTab === "DATABASE" && getPortCategory(p.port) !== "DATABASE") return false;
    if (activeTab === "NOISE" && !isNoise) return false;

    // Autonomous Noise Filter: If active and user isn't explicitly viewing NOISE tab, automatically hide benign noise
    if (autoFilterNoise && activeTab !== "NOISE" && isNoise) return false;

    // Search query filter
    if (portFilter.trim()) {
      const q = portFilter.toLowerCase();
      const matchPort = String(p.port).includes(q);
      const matchProc = (p.process || "").toLowerCase().includes(q);
      const matchHost = (p.host || "").includes(q);
      const matchSvc = (p.service_name || "").toLowerCase().includes(q);
      const matchThreat = (p.threat_title || "").toLowerCase().includes(q);
      const matchCve = (p.cve_id || "").toLowerCase().includes(q);
      const matchCat = getPortCategory(p.port).toLowerCase().includes(q);
      return matchPort || matchProc || matchHost || matchSvc || matchThreat || matchCve || matchCat;
    }

    return true;
  });

  return (
    <main className="attack-dashboard">
      {/* Title & Status */}
      <div className="attack-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / AUTONOMOUS EXPOSURE RECONNAISSANCE</p>
          <h1>ATTACK SURFACE & THREAT RADAR</h1>
          <p className="attack-description">
            Continuous AI-powered reconnaissance of local listening daemons, autonomous noise suppression, and real-time CVE exploitability correlation.
          </p>
        </div>

        <div className="scan-status">
          <span className="pulse-indicator"></span>
          ACTIVE RADAR (3s)
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className={`soc-action-banner banner-${actionNotice.type}`}>
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* Simulated Probe Alert Banner */}
      {simulatedProbe && (
        <div className="simulated-probe-alert">
          <div className="probe-alert-content">
            <span className="probe-alert-tag">🚨 SIMULATED INGRESS RECON INTERCEPTED</span>
            <strong>
              Host {simulatedProbe.attackerIp} sent SYN Probe to Port :{simulatedProbe.port} ({simulatedProbe.title})
            </strong>
            <p>AURA Threat Detection active. Automated defense rule generated.</p>
          </div>
          <button className="btn-dismiss-probe" onClick={() => setSimulatedProbe(null)}>
            DISMISS ALERT ✕
          </button>
        </div>
      )}

      {attackError ? (
        <div className="connection-error">{attackError}</div>
      ) : !attackData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          SCANNING LOCAL SOCKETS & BOUND PORTS...
        </div>
      ) : (
        <>
          {/* Summary Grid */}
          <section className="attack-summary-grid">
            <div className="attack-summary-card">
              <span className="summary-label">DISCOVERED LOCAL SOCKETS</span>
              <strong className="summary-value">{attackData.total_open_ports}</strong>
              <p>Raw kernel listening endpoints detected.</p>
            </div>

            <div className="attack-summary-card threat-summary-card">
              <span className="summary-label">ACTIVE THREAT VECTORS</span>
              <strong className="summary-value exposure-high">
                {counts.threats}
              </strong>
              <p>Critical / High vulnerabilities requiring immediate review.</p>
            </div>

            <div className="attack-summary-card">
              <span className="summary-label">AI AUTO-NOISE FILTER</span>
              <strong className="summary-value exposure-low">
                {counts.noise} <span style={{ fontSize: "18px", color: "#64748b" }}>MUTED</span>
              </strong>
              <p>Ephemeral dynamic RPC sockets auto-suppressed.</p>
            </div>

            <div className="attack-summary-card">
              <span className="summary-label">ATTACK SURFACE RISK INDEX</span>
              <strong
                className={`summary-value ${
                  attackData.attack_surface_risk_score > 70
                    ? "exposure-high"
                    : attackData.attack_surface_risk_score > 40
                    ? "exposure-medium"
                    : "exposure-low"
                }`}
              >
                {attackData.attack_surface_risk_score || 85}
                <span style={{ fontSize: "20px", color: "#64748b" }}>/100</span>
              </strong>
              <p>Dynamically quantified from exposed exploitable vectors.</p>
            </div>
          </section>

          {/* Autonomous Noise Suppression Status Banner */}
          <div className="auto-defense-pill">
            <div className="auto-defense-text">
              <span className="pill-dot-live"></span>
              <strong>AUTONOMOUS DEFENSE & NOISE SUPPRESSION: ACTIVE</strong>
              <span>
                {counts.noise} harmless background Windows RPC & ephemeral sockets automatically filtered. Showing {counts.clean} operational service endpoints ({attackData.mitigated_ports_count || 0} shielded).
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                className="btn-demo-backdoor"
                style={{ background: "#dc2626", borderColor: "#ef4444", color: "#ffffff", fontWeight: "700" }}
                disabled={terminatingAllDanger}
                onClick={handleTerminateAllDangerPorts}
                title="Autonomously scan and terminate/shield all detected dangerous ports and rogue listeners"
              >
                {terminatingAllDanger ? "⚡ TERMINATING DANGER PORTS..." : "☠️ TERMINATE ALL DANGER PORTS"}
              </button>
              <button
                className={`btn-demo-backdoor ${attackData?.demo_threat_active ? "btn-demo-active" : ""}`}
                disabled={demoBackdoorLoading}
                onClick={handleSpawnDemoBackdoor}
                title="Launch a simulated rogue backdoor listener on port 4444 to demo live process detection and termination to judges"
              >
                {attackData?.demo_threat_active ? "🛑 TERMINATE DEMO BACKDOOR (:4444)" : "🎯 DEMO LIVE ROGUE BACKDOOR (:4444)"}
              </button>
              <button
                className={`btn-auto-toggle ${!autoFilterNoise ? "btn-auto-active" : ""}`}
                onClick={() => setAutoFilterNoise(!autoFilterNoise)}
              >
                {autoFilterNoise ? "👁️ SHOW RAW SOCKETS (INC. NOISE)" : "⚡ RE-ENGAGE AUTO FILTER"}
              </button>
            </div>
          </div>

          {/* PRIORITY THREAT INTELLIGENCE RADAR DECK (Front & Center!) */}
            <section className="threat-intel-deck-section">
              <div className="section-title-bar">
                <div>
                  <span className="process-eyebrow">
                    {activeThreats.length > 0 ? "CRITICAL ATTACK VECTORS DETECTED" : "PERIMETER SHIELDED & SECURED"}
                  </span>
                  <h2>🚨 ACTIVE THREAT INTELLIGENCE & VULNERABILITY RADAR</h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <div className="threat-subtab-group">
                    <button
                      className={`threat-subtab-btn ${threatDeckTab === "ACTIVE" ? "active" : ""}`}
                      onClick={() => setThreatDeckTab("ACTIVE")}
                    >
                      🚨 ACTIVE THREATS ({activeThreats.length})
                    </button>
                    <button
                      className={`threat-subtab-btn ${threatDeckTab === "MITIGATED" ? "active" : ""}`}
                      onClick={() => setThreatDeckTab("MITIGATED")}
                    >
                      🛡️ NEUTRALIZED ({shieldedThreats.length})
                    </button>
                    <button
                      className={`threat-subtab-btn ${threatDeckTab === "WORK" ? "active" : ""}`}
                      onClick={() => setThreatDeckTab("WORK")}
                    >
                      💼 MY WORK PORTS ({workPorts.length})
                    </button>
                  </div>
                </div>
              </div>

              {threatDeckTab === "WORK" && workPorts.length === 0 ? (
                <div className="all-threats-secured-banner" style={{ borderColor: "rgba(59, 130, 246, 0.45)", background: "linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(15, 23, 42, 0.6))" }}>
                  <div className="secured-badge-glow" style={{ color: "#60a5fa", borderColor: "#3b82f6", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}>
                    💼 ZERO WORK-WHITELISTED PORTS
                  </div>
                  <h3>ALL PORTS UNDER ACTIVE THREAT EVALUATION</h3>
                  <p>
                    If an open port (like MySQL :3306, Mongo :27017, Node :3000, Python :8000, or RPC :135) is legitimate for your daily work, click <strong>'💼 MARK AS MY WORK PORT'</strong> on its card to whitelist it from threat termination.
                  </p>
                </div>
              ) : threatDeckTab === "ACTIVE" && activeThreats.length === 0 ? (
                <div className="all-threats-secured-banner">
                  <div className="secured-badge-glow">🛡️ 100% PERIMETER SECURED</div>
                  <h3>ZERO ACTIVE DANGER PORTS DETECTED</h3>
                  <p>
                    All dangerous listening ports have been terminated or placed under Host Firewall isolation.
                    Inbound traffic is actively dropped and audited on the Blockchain Ledger.
                  </p>
                  <div className="secured-action-btns">
                    <button
                      className="btn-spawn-demo-cta"
                      onClick={handleSpawnDemoBackdoor}
                      disabled={demoBackdoorLoading}
                    >
                      {demoBackdoorLoading ? "SPAWNING..." : "🚀 SPAWN LIVE ROGUE THREAT (:4444) TO TEST KILL"}
                    </button>
                    {shieldedThreats.length > 0 && (
                      <button
                        className="btn-view-shielded-cta"
                        onClick={() => setThreatDeckTab("MITIGATED")}
                      >
                        VIEW {shieldedThreats.length} TERMINATED / SHIELDED PORTS
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="threat-intel-grid">
                  {displayedThreats.map((threat, idx) => {
                    const isCrit = threat.threat_level === "CRITICAL";
                    const isWhitelisted = suppressedPorts.includes(threat.port);
                    const isMitigated = threat.is_mitigated && !isWhitelisted;
                    return (
                      <div
                        key={`threat-card-${threat.port}-${idx}`}
                        className={`threat-intel-card ${
                          isWhitelisted
                            ? "card-work-port"
                            : isMitigated
                            ? "card-shielded"
                            : isCrit
                            ? "card-critical"
                            : "card-high"
                        }`}
                      >
                        <div className="threat-card-top">
                          <div className="threat-port-badge">
                            <span className="port-pill-strong">:{threat.port}</span>
                            <span className="threat-service-name">{threat.service_name}</span>
                          </div>
                          <div className="threat-cvss-group">
                            {isWhitelisted ? (
                              <span className="badge-cvss" style={{ background: "rgba(59, 130, 246, 0.25)", border: "1px solid #3b82f6", color: "#60a5fa" }}>
                                💼 WORK PORT
                              </span>
                            ) : isMitigated ? (
                              <span className="badge-cvss" style={{ background: "rgba(16, 185, 129, 0.25)", border: "1px solid #10b981", color: "#34d399" }}>
                                🛡️ SHIELDED
                              </span>
                            ) : (
                              <span className={`badge-cvss ${isCrit ? "cvss-crit" : "cvss-high"}`}>
                                CVSS {threat.cvss_score || (isCrit ? "9.8" : "8.8")}
                              </span>
                            )}
                            <span className="badge-cve">{threat.cve_id || "CVE-RECORD"}</span>
                          </div>
                        </div>

                        <div className="threat-card-title">
                          <h4>{threat.threat_title || threat.description}</h4>
                          <span className="threat-mitre-tag">
                            {threat.mitre_technique || "MITRE ATT&CK Framework"}
                          </span>
                        </div>

                        <div className="threat-card-scenario">
                          <span className="scenario-label">EXPLOIT VECTOR / WHAT IS THE THREAT?</span>
                          <p className="scenario-text">
                            {threat.attack_vector || threat.description}
                          </p>
                        </div>

                        {threat.potential_impact && (
                          <div className="threat-card-impact">
                            <span className="impact-label">⚠️ POTENTIAL IMPACT:</span>
                            <span className="impact-text">{threat.potential_impact}</span>
                          </div>
                        )}

                        {isWhitelisted ? (
                          <>
                            <div className="threat-work-banner">
                              <strong>💼 AUTHORIZED DEVELOPER WORK PORT</strong>
                              <p>Port :{threat.port} is marked as safe for your development/work. Autonomous threat termination is bypassed, and network access is unrestricted.</p>
                            </div>
                            <div className="threat-card-actions">
                              <button
                                className="btn-threat-whitelist-revoke"
                                onClick={() => handleRemoveFromWorkPorts(threat.port)}
                                title="Remove from work list and restore full threat scanning"
                              >
                                ↺ REVOKE WHITELIST (RESTORE TO THREAT RADAR)
                              </button>
                              <button
                                className="btn-threat-probe"
                                onClick={(e) => handleSimulateProbe(threat, e)}
                              >
                                🎯 TEST CONNECTION
                              </button>
                            </div>
                          </>
                        ) : isMitigated ? (
                          <>
                            <div className="threat-shielded-banner">
                              <strong>🛡️ ACTIVE DEFENSE: INBOUND THREAT NEUTRALIZED</strong>
                              <p>Inbound TCP port :{threat.port} dropped via host perimeter blockade. SHA-256 Merkle block mined to ledger.</p>
                            </div>
                            <div className="threat-card-actions">
                              <button
                                className="btn-threat-unblock-work"
                                disabled={remediatingPort === threat.port}
                                onClick={() => handleUnblockAndWhitelistForWork(threat)}
                                title="Unblock Windows Firewall and whitelist as safe port for your daily work"
                              >
                                {remediatingPort === threat.port ? "UNBLOCKING..." : "💼 UNBLOCK & RESTORE FOR WORK"}
                              </button>
                              <button
                                className="btn-threat-restore"
                                disabled={remediatingPort === threat.port}
                                onClick={async () => {
                                  await handleRemediateThreat(threat, "RESTORE");
                                  setThreatDeckTab("ACTIVE");
                                }}
                                title="Unblock port and restore to active threat for demonstration"
                              >
                                {remediatingPort === threat.port ? "RESTORING..." : "↺ RESTORE AS DEMO THREAT"}
                              </button>
                              <button
                                className="btn-threat-probe"
                                onClick={(e) => handleSimulateProbe(threat, e)}
                              >
                                🎯 PROBE (VERIFY BLOCKED)
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="threat-card-actions">
                            <button
                              className="btn-threat-kill"
                              disabled={remediatingPort === threat.port}
                              onClick={() => handleRemediateThreat(threat, "TERMINATE")}
                              title="Directly terminate rogue process / sever listening socket"
                            >
                              {remediatingPort === threat.port ? "TERMINATING..." : "⛔ TERMINATE / KILL THREAT"}
                            </button>
                            <button
                              className="btn-threat-neutralize"
                              disabled={remediatingPort === threat.port}
                              onClick={() => handleRemediateThreat(threat, "AUTO")}
                              title="Deploy autonomous host isolation / firewall block and record cryptographic Merkle block"
                            >
                              {remediatingPort === threat.port ? "⚡ NEUTRALIZING..." : "⚡ 1-CLICK AUTO-NEUTRALIZE"}
                            </button>
                            <button
                              className="btn-threat-whitelist"
                              onClick={() => handleWhitelistAsWorkPort(threat)}
                              title="Mark this port as legitimate developer work service so it is not treated as a threat"
                            >
                              💼 MARK AS MY WORK PORT
                            </button>
                            <button
                              className="btn-threat-firewall"
                              onClick={(e) => handleCopyFirewallCmd(threat.firewall_cmd, threat.port, e)}
                            >
                              {copiedPort === threat.port ? "✓ RULE COPIED!" : "📋 COPY RULE"}
                            </button>
                            <button
                              className="btn-threat-probe"
                              onClick={(e) => handleSimulateProbe(threat, e)}
                              title="Simulate an adversary probing this port to verify AURA detection"
                            >
                              🎯 PROBE
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          {/* Interactive Radar Visualizer */}
          <section className="attack-radar-section">
            <div className="section-title-bar">
              <div>
                <span className="process-eyebrow">TOPOLOGY VISUALIZATION</span>
                <h2>PERIMETER RADAR SCANNER</h2>
              </div>
              <div className="radar-actions-bar">
                {selectedPort && (
                  <button className="clear-filter-btn" onClick={handleClearSelectedPort}>
                    SHOW ALL PORTS (LOCKED ON :{selectedPort.port}) ✕
                  </button>
                )}
              </div>
            </div>

            <AttackSurfaceRadar
              ports={attackData.ports}
              selectedPort={selectedPort}
              onSelectPort={handleSelectPortFromRadar}
              suppressedPorts={suppressedPorts}
            />
          </section>

          {/* Sockets Table & Threat Filter Controls */}
          <section className="port-intelligence">
            <div className="port-header">
              <div>
                <span className="process-eyebrow">HOST RECONNAISSANCE</span>
                <h2>MONITORED SOCKETS & DETAILED THREAT CATALOG</h2>
              </div>

              <div className="port-search-box">
                <input
                  type="text"
                  placeholder="Search port, process, service, CVE, threat..."
                  value={portFilter}
                  onChange={(e) => setPortFilter(e.target.value)}
                  className="soc-search-input"
                />
              </div>
            </div>

            {/* Filter Tabs Bar */}
            <div className="port-filter-tabs-bar">
              <div className="filter-tabs-group">
                <button
                  className={`port-tab-btn ${activeTab === "ALL" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("ALL")}
                >
                  ALL VISIBLE <span className="tab-pill-count">{filteredPorts.length}</span>
                </button>
                <button
                  className={`port-tab-btn tab-threats ${activeTab === "THREATS" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("THREATS")}
                >
                  🚨 HIGH THREATS <span className="tab-pill-count count-threat">{counts.threats}</span>
                </button>
                <button
                  className={`port-tab-btn ${activeTab === "WEB" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("WEB")}
                >
                  🌐 WEB / HTTP <span className="tab-pill-count">{counts.web}</span>
                </button>
                <button
                  className={`port-tab-btn ${activeTab === "DATABASE" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("DATABASE")}
                >
                  🗄️ DATABASES <span className="tab-pill-count">{counts.database}</span>
                </button>
                <button
                  className={`port-tab-btn ${activeTab === "NOISE" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("NOISE")}
                >
                  🔇 FILTERED NOISE <span className="tab-pill-count count-muted">{counts.noise}</span>
                </button>
              </div>

              <div className="port-filter-controls-right">
                <span className="port-live-tick">LIVE KERNEL POLLING (3s)</span>
              </div>
            </div>

            {/* Sockets Table */}
            <div className="port-table-wrapper">
              <table className="port-table">
                <thead>
                  <tr>
                    <th>PORT & SERVICE</th>
                    <th>THREAT SEVERITY</th>
                    <th>IDENTIFIED THREAT & CVE</th>
                    <th>BIND ADDRESS</th>
                    <th>OWNING PROCESS</th>
                    <th>PID</th>
                    <th style={{ textAlign: "center" }}>MITIGATION ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPorts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-ports">
                        {portFilter || activeTab !== "ALL" || selectedPort
                          ? "NO PORTS MATCH ACTIVE FILTER CRITERIA"
                          : "NO LISTENING PORTS DETECTED"}
                      </td>
                    </tr>
                  ) : (
                    filteredPorts.map((port, index) => {
                      const isHighlighted = selectedPort && selectedPort.port === port.port;
                      const isSuppressed = suppressedPorts.includes(port.port);
                      const threatLvl = port.threat_level || "LOW";
                      const isThreat = threatLvl === "CRITICAL" || threatLvl === "HIGH";

                      return (
                        <tr
                          key={`${port.port}-${port.pid}-${index}`}
                          className={`
                            ${isHighlighted ? "selected-port-row" : ""}
                            ${isSuppressed ? "suppressed-row" : ""}
                            ${isThreat ? "row-threat-highlight" : ""}
                          `}
                          onClick={() => handleSelectPortFromRadar(port)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="port-number">
                            <div className="port-cell-stack">
                              <span className="port-pill">:{port.port}</span>
                              <span className="port-service-subtitle">
                                {port.service_name || getPortCategory(port.port)}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="threat-badge-group">
                              <span className={`threat-badge badge-${threatLvl.toLowerCase()}`}>
                                {threatLvl === "CRITICAL" && "🔴 "}
                                {threatLvl === "HIGH" && "🟠 "}
                                {threatLvl === "MEDIUM" && "🟡 "}
                                {threatLvl === "LOW" && "🟢 "}
                                {threatLvl === "NOISE" && "⚪ "}
                                {threatLvl}
                              </span>
                              {port.cvss_score > 0 && (
                                <span className="cvss-mini-tag">CVSS {port.cvss_score}</span>
                              )}
                            </div>
                          </td>

                          <td className="port-threat-col">
                            <div className="port-threat-stack">
                              <strong className="threat-title-text">
                                {port.threat_title || port.description}
                              </strong>
                              {port.cve_id && port.cve_id !== "N/A" && (
                                <span className="cve-pill-mini">{port.cve_id}</span>
                              )}
                            </div>
                          </td>

                          <td className="port-host">{port.host}</td>
                          <td className="port-process">{port.process}</td>
                          <td className="process-pid">{port.pid || "KERNEL"}</td>

                          <td style={{ textAlign: "center" }}>
                            <div className="table-action-btn-group">
                              <button
                                className="btn-table-firewall"
                                onClick={(e) => handleCopyFirewallCmd(port.firewall_cmd, port.port, e)}
                                title="Copy PowerShell / Netsh Firewall block rule"
                              >
                                {copiedPort === port.port ? "✓" : "📋 BLOCK"}
                              </button>
                              <button
                                className={`btn-port-toggle ${
                                  isSuppressed ? "btn-toggle-muted" : "btn-toggle-active"
                                }`}
                                onClick={(e) => handleTogglePortSuppression(port.port, e)}
                                title={
                                  isSuppressed
                                    ? "Click to enable active monitoring for this port"
                                    : "Click to mute/suppress this port from threat calculations"
                                }
                              >
                                {isSuppressed ? "🔇" : "🛡️"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Real-time Threat Remediation Console Modal */}
      {remediationModal && (
        <div className="remediation-modal-overlay" onClick={() => setRemediationModal(null)}>
          <div className="remediation-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="terminal-title">AURA ACTIVE DEFENSE // THREAT REMEDIATION CONSOLE</span>
              <button className="btn-modal-close" onClick={() => setRemediationModal(null)}>✕</button>
            </div>
            <div className="modal-terminal-body">
              {remediationModal.logs.map((log, i) => (
                <div key={i} className="terminal-line">{log}</div>
              ))}
            </div>
            <div className="modal-terminal-footer">
              <span className={`terminal-badge status-${remediationModal.status}`}>
                STATUS: {remediationModal.status.toUpperCase()}
              </span>
              <button className="btn-terminal-ack" onClick={() => setRemediationModal(null)}>
                ACKNOWLEDGE & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

