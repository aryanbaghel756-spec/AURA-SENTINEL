import React from "react";

export default function PulseStrip({ landingStats }) {
  const cpuLoad = landingStats ? `${Math.round(landingStats.cpu_usage)}%` : "—";
  const riskScore = landingStats ? `${landingStats.risk_score}/100` : "—";
  const openPorts = landingStats ? landingStats.open_ports : "—";
  const memLoad = landingStats ? `${landingStats.memory_usage}%` : "—";

  return (
    <section id="aura-pulse-strip" className="pulse-strip">
      <div className="pulse-track">
        {[0, 1].map((loopIndex) => (
          <div className="pulse-set" key={loopIndex}>
            <span>LIVE CPU LOAD: {cpuLoad}</span>
            <span className="pulse-divider">◆</span>
            <span>RISK SCORE: {riskScore}</span>
            <span className="pulse-divider">◆</span>
            <span>OPEN PORTS: {openPorts}</span>
            <span className="pulse-divider">◆</span>
            <span>MEMORY LOAD: {memLoad}</span>
            <span className="pulse-divider">◆</span>
            <span>CONTINUOUS TELEMETRY ACTIVE</span>
            <span className="pulse-divider">◆</span>
            <span>9 INTELLIGENCE MODULES</span>
            <span className="pulse-divider">◆</span>
            <span>SIH26105</span>
            <span className="pulse-divider">◆</span>
          </div>
        ))}
      </div>
    </section>
  );
}
