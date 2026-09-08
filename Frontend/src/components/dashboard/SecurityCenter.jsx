import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";
import AuraCore from "../common/AuraCore";

export default function SecurityCenter({ onOpenModule, onGenerateReport }) {
  const [metrics, setMetrics] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [dbStats, setDbStats] = useState(null);
  const [eventLogs, setEventLogs] = useState([]);
  const [eventFilter, setEventFilter] = useState("all");
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Format epoch timestamp to relative / time string
  const formatEventTime = (timestamp) => {
    if (!timestamp) return "RECENT";
    const delta = Math.floor(Date.now() / 1000 - timestamp);
    if (delta < 5) return "JUST NOW";
    if (delta < 60) return `${delta}s ago`;
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
    const d = new Date(timestamp * 1000);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const fetchSecurityData = async (mounted = true) => {
    try {
      const [m, r, dStats, dEvents] = await Promise.all([
        api.getAnalyticsMetrics().catch(() => null),
        api.getRiskIntelligence().catch(() => null),
        api.getDatabaseStats().catch(() => null),
        api.getDatabaseEvents("ALL", 50).catch(() => ({ events: [] })),
      ]);

      if (mounted) {
        if (m) setMetrics(m);
        if (r) setRiskData(r);
        if (dStats) setDbStats(dStats);
        if (dEvents && Array.isArray(dEvents.events)) {
          setEventLogs(dEvents.events);
        }
      }
    } catch (err) {
      console.warn("Telemetry polling issue:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchSecurityData(mounted);
    const interval = setInterval(() => fetchSecurityData(mounted), 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleFilterClick = async (filterKey) => {
    audioService.playClick();
    setEventFilter(filterKey);
    setLoadingEvents(true);
    try {
      const res = await api.getDatabaseEvents("ALL", 50);
      if (res && Array.isArray(res.events)) {
        setEventLogs(res.events);
      }
    } catch {
      // Keep existing
    } finally {
      setLoadingEvents(false);
    }
  };

  // Filter logs locally if needed
  const filteredLogs = eventLogs.filter((l) => {
    if (eventFilter === "all") return true;
    const type = (l.event_type || l.type || "").toLowerCase();
    return type === eventFilter.toLowerCase();
  });

  return (
    <div className="security-center-panel">
      <div className="security-center-header">
        <div>
          <span className="process-eyebrow">GLOBAL SECURITY WORKSTATION</span>
          <h2>AURA SECURITY CENTER & TELEMETRY HUB</h2>
          <p>
            Persistent SQLite audit trail correlating real-time OS telemetry, AI anomaly detection, and active threat defense.
          </p>
        </div>

        <div className="security-center-actions">
          {dbStats && (
            <div className="db-live-badge" title={`Database location: ${dbStats.db_path}`}>
              <span className="db-pulse-dot"></span>
              <span>SQLITE 3 WAL: <strong>{dbStats.counts?.security_events || 0} EVENTS</strong> ({dbStats.db_size_kb} KB)</span>
            </div>
          )}

          <button
            className="soc-back-btn"
            onClick={() => {
              audioService.playCommand();
              if (onGenerateReport) onGenerateReport();
            }}
          >
            📄 EXPORT AUDIT REPORT
          </button>

          <button
            className="launch-attack-btn"
            style={{ padding: "8px 16px", fontSize: "11px" }}
            onClick={() => {
              audioService.playClick();
              if (onOpenModule) onOpenModule("what-if-engine");
            }}
          >
            🔥 WARGAME SANDBOX
          </button>
        </div>
      </div>

      <div className="security-grid-overview">
        {/* Arc Reactor Core Status */}
        <div className="security-core-card">
          <AuraCore state="IDLE" size={140} interactive={true} />
          <div className="security-core-info">
            <span className="core-badge-online">ALL ENGINES ONLINE</span>
            <h3>DEFENSIVE LEVEL: ALPHA</h3>
            <p>Smart India Hackathon 2026 • SIH26105</p>
            <div className="core-spec-row">
              <span>SYSTEM UPTIME:</span>
              <strong>{metrics ? metrics.system_uptime_formatted : "123h 48m"}</strong>
            </div>
          </div>
        </div>

        {/* Platform Specs */}
        <div className="security-stat-box">
          <span className="stat-box-title">HARDWARE THREADING</span>
          <div className="stat-big-num">
            {metrics ? metrics.cpu_count_logical : "28"}
            <small>LOGICAL CORES</small>
          </div>
          <div className="stat-sub-detail">
            <span>PHYSICAL CORES: <strong>{metrics ? metrics.cpu_count_physical : "20"}</strong></span>
            <span>OS: <strong>{metrics?.platform?.os || "Windows NT"}</strong></span>
          </div>
        </div>

        {/* Active Sockets */}
        <div className="security-stat-box">
          <span className="stat-box-title">KERNEL SOCKET SURFACE</span>
          <div className="stat-big-num">
            {riskData ? riskData.open_ports : "6"}
            <small>ACTIVE DAEMONS</small>
          </div>
          <div className="stat-sub-detail">
            <span>TOTAL SOCKETS: <strong>{metrics?.active_sockets_count || "768"}</strong></span>
            <span>STORAGE RISK: <strong style={{ color: "var(--threat-nominal)" }}>NOMINAL</strong></span>
          </div>
        </div>
      </div>

      {/* Real-time Event Stream from Persistent SQLite */}
      <div className="security-events-section">
        <div className="events-header">
          <div>
            <span className="process-eyebrow">PERSISTENT SQLITE AUDIT TRAIL</span>
            <h3>LIVE DEFENSE EVENT STREAM</h3>
          </div>

          <div className="event-filters">
            {["all", "auth", "ids", "system", "process", "shield", "attack_sim"].map((f) => (
              <button
                key={f}
                className={`event-filter-btn ${eventFilter === f ? "active" : ""}`}
                onClick={() => handleFilterClick(f)}
              >
                {f.toUpperCase().replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="events-feed-list">
          {filteredLogs.length === 0 ? (
            <div className="empty-events-state">
              <span>🛡️</span>
              <p>No security events recorded under current filter.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const eventType = (log.event_type || log.type || "INFO").toUpperCase();
              const severity = (log.severity || "NOMINAL").toUpperCase();
              const isCrit = severity === "CRITICAL" || severity === "HIGH";
              const isWarn = severity === "WARNING";

              return (
                <div key={log.id} className={`event-row ${isCrit ? "crit-border" : ""}`}>
                  <span className={`event-type-badge ${eventType.toLowerCase()}`}>
                    {eventType}
                  </span>
                  <span className="event-time">
                    {formatEventTime(log.created_at)}
                  </span>
                  <span className="event-text">
                    <strong>{log.title}</strong>
                    {log.description && ` — ${log.description}`}
                  </span>
                  <span
                    className="event-severity-pill"
                    style={{
                      color: isCrit
                        ? "var(--threat-critical)"
                        : isWarn
                        ? "var(--threat-warning)"
                        : "var(--threat-nominal)",
                      borderColor: isCrit
                        ? "rgba(255, 77, 77, 0.4)"
                        : isWarn
                        ? "rgba(255, 187, 0, 0.4)"
                        : "rgba(0, 240, 255, 0.2)",
                    }}
                  >
                    {severity}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
