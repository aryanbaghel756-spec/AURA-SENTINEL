import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function FinancialRisk() {
  const [financialData, setFinancialData] = useState(null);
  const [financialError, setFinancialError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFinancial = async () => {
      try {
        const data = await api.getFinancialRisk();
        if (!isMounted) return;
        setFinancialData(data);
        setFinancialError("");
      } catch {
        if (!isMounted) return;
        setFinancialError("FINANCIAL RISK ENGINE UNAVAILABLE");
      }
    };

    fetchFinancial();
    const interval = setInterval(fetchFinancial, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="financial-dashboard">
      <div className="financial-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / BUSINESS IMPACT ENGINE</p>
          <h1>FINANCIAL RISK</h1>
          <p className="financial-description">
            Translates real-time technical indicators into actuarial business impact estimates, quantifying potential downtime and incident response costs.
          </p>
        </div>

        <div className="financial-live-status">
          <span className="pulse-indicator"></span>
          ACTUARIAL MODEL (5s)
        </div>
      </div>

      {financialError ? (
        <div className="connection-error">{financialError}</div>
      ) : !financialData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          CALCULATING FINANCIAL EXPOSURE MATRICES...
        </div>
      ) : (
        <>
          <section className="financial-hero">
            <div className="financial-exposure-card">
              <span className="exposure-eyebrow">TOTAL ESTIMATED BUSINESS EXPOSURE</span>
              <h2>₹{financialData.total_financial_exposure.toLocaleString("en-IN")}</h2>
              <p>
                Modeled aggregate financial liability in the event of an exploited vulnerability based on current live system state.
              </p>
            </div>

            <div className="financial-risk-level">
              <span className="level-eyebrow">EXPOSURE SEVERITY</span>
              <strong
                className={`financial-badge ${
                  financialData.financial_risk_level === "CRITICAL"
                    ? "financial-critical"
                    : financialData.financial_risk_level === "HIGH"
                    ? "financial-high"
                    : financialData.financial_risk_level === "MODERATE"
                    ? "financial-moderate"
                    : "financial-low"
                }`}
              >
                {financialData.financial_risk_level}
              </strong>
              <small>Calibrated against Indian SME & Enterprise telemetry</small>
            </div>
          </section>

          <section className="financial-stats-grid">
            <div className="financial-stat-card">
              <span className="stat-label">ESTIMATED HOURLY LOSS</span>
              <strong className="stat-value">₹{financialData.estimated_hourly_loss.toLocaleString("en-IN")}</strong>
              <p>Operational disruption cost per hour of degraded service.</p>
            </div>

            <div className="financial-stat-card">
              <span className="stat-label">PREDICTED DOWNTIME</span>
              <strong className="stat-value">{financialData.estimated_downtime_hours} HOURS</strong>
              <p>Estimated MTTR (Mean Time To Recovery) based on risk posture.</p>
            </div>

            <div className="financial-stat-card">
              <span className="stat-label">INCIDENT IMPACT COST</span>
              <strong className="stat-value">₹{financialData.potential_incident_cost.toLocaleString("en-IN")}</strong>
              <p>Calculated as hourly loss multiplied by estimated downtime.</p>
            </div>

            <div className="financial-stat-card">
              <span className="stat-label">INCIDENT RESPONSE & RECOVERY</span>
              <strong className="stat-value">₹{financialData.recovery_cost.toLocaleString("en-IN")}</strong>
              <p>Estimated forensic, remediation, and system restoration costs.</p>
            </div>
          </section>

          <section className="financial-drivers">
            <div className="financial-drivers-header">
              <div>
                <span className="process-eyebrow">TELEMETRY IMPACT DECOMPOSITION</span>
                <h2>WHAT IS DRIVING THE EXPOSURE?</h2>
              </div>
              <div className="technical-score">
                TECHNICAL RISK SCORE: {financialData.technical_risk_score} / 100
              </div>
            </div>

            <div className="financial-driver-grid">
              <div className="financial-driver">
                <span>CPU WORKLOAD</span>
                <strong>{financialData.cpu_usage}%</strong>
                <small>Compute stress factor</small>
              </div>

              <div className="financial-driver">
                <span>MEMORY CONSUMPTION</span>
                <strong>{financialData.memory_usage}%</strong>
                <small>RAM saturation factor</small>
              </div>

              <div className="financial-driver">
                <span>STORAGE CAPACITY</span>
                <strong>{financialData.disk_usage}%</strong>
                <small>Disk pressure factor</small>
              </div>

              <div className="financial-driver">
                <span>LISTENING SOCKETS</span>
                <strong>{financialData.open_ports} PORTS</strong>
                <small>External exposure factor</small>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
