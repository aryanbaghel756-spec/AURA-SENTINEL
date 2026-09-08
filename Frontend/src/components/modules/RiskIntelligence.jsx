import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";
import { generateSecurityAuditReport } from "../../services/reportGenerator";

export default function RiskIntelligence() {
  const [riskData, setRiskData] = useState(null);
  const [riskError, setRiskError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRisk = async () => {
      try {
        const data = await api.getRiskIntelligence();
        if (!isMounted) return;
        setRiskData(data);
        setRiskError("");
      } catch {
        if (!isMounted) return;
        setRiskError("RISK INTELLIGENCE CONNECTION LOST");
      }
    };

    fetchRisk();
    const interval = setInterval(fetchRisk, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStrokeColor = (score) => {
    if (score >= 60) return "var(--threat-critical)";
    if (score >= 30) return "var(--threat-moderate)";
    return "var(--threat-low)";
  };

  // SVG circle calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = riskData
    ? circumference - (riskData.risk_score / 100) * circumference
    : circumference;

  return (
    <main className="risk-dashboard">
      <div className="risk-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / THREAT ANALYSIS ENGINE</p>
          <h1>RISK INTELLIGENCE</h1>
          <p className="risk-description">
            Real-time security posture synthesis correlating compute pressure, memory saturation, and listening socket exposure into a unified risk metric.
          </p>
        </div>

        <div className="risk-live-status">
          <span className="pulse-indicator"></span>
          REAL-TIME CORRELATION (3s)
        </div>
      </div>

      {riskError ? (
        <div className="connection-error">{riskError}</div>
      ) : !riskData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          COMPUTING MULTI-VECTOR RISK MATRIX...
        </div>
      ) : (
        <>
          <section className="risk-score-section">
            <div className="risk-gauge-container">
              <svg width="220" height="220" className="risk-radial-svg">
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  className="risk-track-bg"
                />
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  className="risk-track-fill"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    stroke: getStrokeColor(riskData.risk_score),
                  }}
                />
              </svg>
              <div className="risk-gauge-center">
                <span className="risk-score-number">{riskData.risk_score}</span>
                <span className="risk-score-label">/ 100 SCORE</span>
              </div>
            </div>

            <div className="risk-summary">
              <span className="risk-posture-eyebrow">DEFENSIVE POSTURE RATING</span>
              <h2
                className={`risk-headline ${
                  riskData.risk_level === "HIGH"
                    ? "risk-high"
                    : riskData.risk_level === "MODERATE"
                    ? "risk-moderate"
                    : "risk-low"
                }`}
              >
                {riskData.risk_level} THREAT POSTURE
              </h2>

              <p>
                AURA continuously correlates hardware resource consumption with external socket exposure.
                {riskData.risk_score >= 60 && " Immediate mitigation recommended to reduce listening attack surface and processor spikes."}
                {riskData.risk_score >= 30 && riskData.risk_score < 60 && " System is operating under moderate load with non-critical exposure vectors."}
                {riskData.risk_score < 30 && " System operating within optimal low-risk defense boundaries."}
              </p>

              <div className="risk-meta-tags">
                <span className="risk-meta-tag">SAMPLING INTERVAL: 3 SEC</span>
                <span className="risk-meta-tag">HEURISTIC WEIGHTED</span>
                <button
                  className="generate-audit-btn"
                  onClick={() => {
                    audioService.playCommand();
                    generateSecurityAuditReport({ riskData });
                  }}
                >
                  <span>📄</span> EXPORT EXECUTIVE AUDIT REPORT
                </button>
              </div>
            </div>
          </section>

          <section className="risk-factors">
            <div className="risk-factors-header">
              <span>CONTRIBUTING SIGNALS</span>
              <h2>RISK FACTOR DECOMPOSITION</h2>
            </div>

            <div className="risk-factors-grid">
              {/* CPU Factor */}
              <div className="risk-factor-card">
                <div className="factor-top">
                  <span>PROCESSOR LOAD</span>
                  <strong>{riskData.cpu_usage}%</strong>
                </div>
                <div className="risk-factor-track">
                  <div
                    className="risk-factor-fill"
                    style={{
                      width: `${Math.min(riskData.cpu_usage, 100)}%`,
                      backgroundColor: riskData.cpu_usage > 75 ? "var(--threat-critical)" : "var(--aura-cyan)",
                    }}
                  ></div>
                </div>
                <p>Spikes above 75% increase risk score by up to 25 pts.</p>
              </div>

              {/* Memory Factor */}
              <div className="risk-factor-card">
                <div className="factor-top">
                  <span>MEMORY PRESSURE</span>
                  <strong>{riskData.memory_usage}%</strong>
                </div>
                <div className="risk-factor-track">
                  <div
                    className="risk-factor-fill"
                    style={{
                      width: `${Math.min(riskData.memory_usage, 100)}%`,
                      backgroundColor: riskData.memory_usage > 80 ? "var(--threat-high)" : "var(--aura-blue)",
                    }}
                  ></div>
                </div>
                <p>Exhaustion risks service crashes and DOS vectors.</p>
              </div>

              {/* Storage Factor */}
              <div className="risk-factor-card">
                <div className="factor-top">
                  <span>STORAGE SATURATION</span>
                  <strong>{riskData.disk_usage}%</strong>
                </div>
                <div className="risk-factor-track">
                  <div
                    className="risk-factor-fill"
                    style={{
                      width: `${Math.min(riskData.disk_usage, 100)}%`,
                      backgroundColor: riskData.disk_usage > 85 ? "var(--threat-moderate)" : "var(--threat-nominal)",
                    }}
                  ></div>
                </div>
                <p>Critical threshold at 85% disk usage.</p>
              </div>

              {/* Port Factor */}
              <div className="risk-factor-card">
                <div className="factor-top">
                  <span>EXPOSED PORTS</span>
                  <strong>{riskData.open_ports} PORTS</strong>
                </div>
                <div className="port-risk-visual">
                  <span
                    className={`risk-port-badge ${
                      riskData.open_ports > 8
                        ? "high"
                        : riskData.open_ports > 3
                        ? "medium"
                        : "low"
                    }`}
                  >
                    {riskData.open_ports > 8
                      ? "ELEVATED EXPOSURE"
                      : riskData.open_ports > 3
                      ? "MODERATE EXPOSURE"
                      : "MINIMAL EXPOSURE"}
                  </span>
                </div>
                <p>Over 8 open ports triggers network risk weighting.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
