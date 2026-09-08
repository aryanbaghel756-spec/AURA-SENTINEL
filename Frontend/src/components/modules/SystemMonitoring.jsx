import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import Sparkline from "../common/Sparkline";
import ConfirmModal from "../common/ConfirmModal";
import { audioService } from "../../services/audioService";

export default function SystemMonitoring() {
  const [systemData, setSystemData] = useState(null);
  const [systemError, setSystemError] = useState("");
  const [processData, setProcessData] = useState(null);
  const [processError, setProcessError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("memory"); // memory | cpu
  const [killModal, setKillModal] = useState({ isOpen: false, pid: null, name: "" });
  const [actionFeedback, setActionFeedback] = useState("");

  // Real-time telemetry history for sparklines (last 20 points)
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memHistory, setMemHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      try {
        const sys = await api.getSystemInfo();
        if (!isMounted) return;
        setSystemData(sys);
        setSystemError("");

        setCpuHistory((prev) => [...prev.slice(-19), sys.cpu_percent]);
        setMemHistory((prev) => [...prev.slice(-19), sys.memory.percent]);
      } catch {
        if (!isMounted) return;
        setSystemError("AURA BACKEND CONNECTION LOST");
      }
    };

    const fetchProc = async () => {
      try {
        const proc = await api.getProcesses();
        if (!isMounted) return;
        setProcessData(proc);
        setProcessError("");
      } catch {
        if (!isMounted) return;
        setProcessError("PROCESS INTELLIGENCE UNAVAILABLE");
      }
    };

    fetchTelemetry();
    fetchProc();

    const interval = setInterval(() => {
      fetchTelemetry();
      fetchProc();
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredProcesses = processData
    ? processData.processes
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(p.pid).includes(searchQuery))
        .sort((a, b) => (sortBy === "cpu" ? b.cpu_percent - a.cpu_percent : b.memory_percent - a.memory_percent))
    : [];

  const handleConfirmKill = async () => {
    if (!killModal.pid) return;
    try {
      const result = await api.killProcess(killModal.pid);
      if (result.status === "TERMINATED") {
        audioService.playSuccess();
        setActionFeedback(`SUCCESS: Process '${result.name}' (PID: ${result.pid}) terminated.`);
        // Refresh processes
        const proc = await api.getProcesses();
        setProcessData(proc);
      } else {
        audioService.playAlert();
        setActionFeedback(`ACTION FAILED: ${result.reason || "Access denied or kernel protected."}`);
      }
    } catch {
      audioService.playAlert();
      setActionFeedback("ERROR: Could not communicate termination signal to backend.");
    } finally {
      setKillModal({ isOpen: false, pid: null, name: "" });
      setTimeout(() => setActionFeedback(""), 4500);
    }
  };

  return (
    <main className="monitoring-dashboard">
      <ConfirmModal
        isOpen={killModal.isOpen}
        title="PROCESS TERMINATION DIRECTIVE"
        message={`Forcefully terminate process '${killModal.name}' (PID: ${killModal.pid})? Unsaved process memory will be purged immediately.`}
        confirmText="TERMINATE PROCESS"
        isDestructive={true}
        onConfirm={handleConfirmKill}
        onCancel={() => setKillModal({ isOpen: false, pid: null, name: "" })}
      />

      <div className="monitoring-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / LIVE TELEMETRY</p>
          <h1>SYSTEM MONITORING</h1>
          <p className="monitoring-description">
            Continuous real-time kernel hardware telemetry and active memory-consuming process auditing.
          </p>
        </div>

        <div className="live-status">
          <span className="pulse-indicator"></span>
          LIVE POLLING (2s)
        </div>
      </div>

      {actionFeedback && (
        <div className="filesec-message-toast" style={{ marginBottom: "20px" }}>
          {actionFeedback}
        </div>
      )}

      {systemError ? (
        <div className="connection-error">{systemError}</div>
      ) : !systemData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          CONNECTING TO HARDWARE SENSORS...
        </div>
      ) : (
        <>
          <section className="system-stats-grid">
            {/* CPU Card */}
            <div className="system-stat-card">
              <div className="stat-card-top">
                <span className="stat-label">CPU LOAD</span>
                <span className={`stat-pill ${systemData.cpu_percent > 75 ? "critical" : systemData.cpu_percent > 50 ? "warning" : "nominal"}`}>
                  {systemData.cpu_percent < 70 ? "STABLE" : "ELEVATED"}
                </span>
              </div>

              <div className="stat-value">
                {systemData.cpu_percent}
                <small>%</small>
              </div>

              <div className="sparkline-wrapper">
                <Sparkline data={cpuHistory} width={220} height={36} color={systemData.cpu_percent > 75 ? "#ff2a55" : "#00f0ff"} />
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${systemData.cpu_percent}%`,
                    backgroundColor: systemData.cpu_percent > 75 ? "var(--threat-critical)" : "var(--aura-cyan)",
                  }}
                ></div>
              </div>

              <div className="stat-bottom">{systemData.cpu_cores} LOGICAL CORES DETECTED</div>
            </div>

            {/* Memory Card */}
            <div className="system-stat-card">
              <div className="stat-card-top">
                <span className="stat-label">MEMORY USAGE</span>
                <span className={`stat-pill ${systemData.memory.percent > 80 ? "critical" : systemData.memory.percent > 65 ? "warning" : "nominal"}`}>
                  {systemData.memory.percent < 80 ? "OPTIMAL" : "HIGH"}
                </span>
              </div>

              <div className="stat-value">
                {systemData.memory.percent}
                <small>%</small>
              </div>

              <div className="sparkline-wrapper">
                <Sparkline data={memHistory} width={220} height={36} color={systemData.memory.percent > 80 ? "#ff7700" : "#0b8cff"} />
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${systemData.memory.percent}%`,
                    backgroundColor: systemData.memory.percent > 80 ? "var(--threat-high)" : "var(--aura-blue)",
                  }}
                ></div>
              </div>

              <div className="stat-bottom">
                {systemData.memory.used} GB USED / {systemData.memory.total} GB TOTAL
              </div>
            </div>

            {/* Storage Card */}
            <div className="system-stat-card">
              <div className="stat-card-top">
                <span className="stat-label">PRIMARY DISK (C:\)</span>
                <span className={`stat-pill ${systemData.disk.percent > 85 ? "warning" : "nominal"}`}>
                  {systemData.disk.percent < 85 ? "HEALTHY" : "LOW SPACE"}
                </span>
              </div>

              <div className="stat-value">
                {systemData.disk.percent}
                <small>%</small>
              </div>

              <div className="disk-spacer" style={{ height: "36px" }}></div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${systemData.disk.percent}%`,
                    backgroundColor: systemData.disk.percent > 85 ? "var(--threat-moderate)" : "var(--threat-nominal)",
                  }}
                ></div>
              </div>

              <div className="stat-bottom">
                {systemData.disk.used} GB USED / {systemData.disk.total} GB TOTAL
              </div>
            </div>
          </section>

          {/* Telemetry Overview */}
          <section className="system-overview">
            <div className="overview-header">
              <span>KERNEL TELEMETRY SUMMARY</span>
              <span>SAMPLING: EVERY 2000MS</span>
            </div>

            <div className="telemetry-grid">
              <div className="telemetry-row">
                <span>PROCESSOR STATUS</span>
                <strong className={systemData.cpu_percent < 70 ? "val-nominal" : "val-warning"}>
                  {systemData.cpu_percent < 70 ? "STABLE EXECUTION" : "HIGH COMPUTE BURDEN"}
                </strong>
              </div>

              <div className="telemetry-row">
                <span>VIRTUAL MEMORY</span>
                <strong className={systemData.memory.percent < 80 ? "val-nominal" : "val-warning"}>
                  {systemData.memory.percent < 80 ? "BALANCED ALLOCATION" : "NEAR MEMORY SATURATION"}
                </strong>
              </div>

              <div className="telemetry-row">
                <span>STORAGE INTEGRITY</span>
                <strong className={systemData.disk.percent < 85 ? "val-nominal" : "val-warning"}>
                  {systemData.disk.percent < 85 ? "NORMAL HEADROOM" : "STORAGE RESTRICTION"}
                </strong>
              </div>

              <div className="telemetry-row">
                <span>AURA TELEMETRY LINK</span>
                <strong className="val-nominal">ACTIVE & SYNCHRONIZED</strong>
              </div>
            </div>
          </section>

          {/* Process Intelligence */}
          <section className="process-intelligence">
            <div className="process-header">
              <div>
                <span className="process-eyebrow">AURA LIVE ANALYSIS</span>
                <h2>ACTIVE PROCESS AUDIT</h2>
              </div>

              <div className="process-controls">
                <input
                  type="text"
                  placeholder="Filter by name or PID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="soc-search-input"
                />

                <div className="sort-toggles">
                  <button
                    className={`sort-toggle ${sortBy === "memory" ? "active" : ""}`}
                    onClick={() => setSortBy("memory")}
                  >
                    SORT BY RAM
                  </button>
                  <button
                    className={`sort-toggle ${sortBy === "cpu" ? "active" : ""}`}
                    onClick={() => setSortBy("cpu")}
                  >
                    SORT BY CPU
                  </button>
                </div>

                <div className="process-count">
                  {processData ? `${filteredProcesses.length} / ${processData.total_processes} PROCESSES` : "AUDITING..."}
                </div>
              </div>
            </div>

            {processError ? (
              <div className="process-error">{processError}</div>
            ) : !processData ? (
              <div className="process-loading">
                <div className="module-loader"></div>
                ANALYZING SYSTEM PROCESSES...
              </div>
            ) : (
              <div className="process-table-wrapper">
                <table className="process-table">
                  <thead>
                    <tr>
                      <th>PROCESS IDENTIFIER</th>
                      <th>PID</th>
                      <th>CPU LOAD</th>
                      <th>MEMORY LOAD</th>
                      <th>SECURITY POSTURE</th>
                      <th>MITIGATION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProcesses.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-ports">
                          NO PROCESSES MATCH YOUR FILTER
                        </td>
                      </tr>
                    ) : (
                      filteredProcesses.map((proc) => {
                        const isHighUsage = proc.cpu_percent > 50 || proc.memory_percent > 15;
                        return (
                          <tr key={proc.pid}>
                            <td className="process-name">
                              <span className={`process-indicator ${isHighUsage ? "warning" : "stable"}`}></span>
                              {proc.name}
                            </td>
                            <td className="process-pid">{proc.pid}</td>
                            <td>{proc.cpu_percent}%</td>
                            <td>{proc.memory_percent}%</td>
                            <td>
                              <span className={`process-status ${isHighUsage ? "warning" : "stable"}`}>
                                {isHighUsage ? "HIGH USAGE" : "NORMAL"}
                              </span>
                            </td>
                            <td>
                              <button
                                className="soc-btn-secondary small destructive"
                                onClick={() => {
                                  audioService.playClick();
                                  setKillModal({ isOpen: true, pid: proc.pid, name: proc.name });
                                }}
                                title="Terminate Process"
                              >
                                KILL
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
