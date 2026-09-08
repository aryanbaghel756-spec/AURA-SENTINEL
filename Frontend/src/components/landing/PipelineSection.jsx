import React from "react";
import { audioService } from "../../services/audioService";

const PIPELINE_STEPS = [
  {
    step: "01",
    stage: "DETECT",
    icon: "◉",
    title: "Endpoint & Network Telemetry",
    text: "Extracts live CPU, memory, disk, process trees, and open listening ports directly from host kernel interfaces.",
    badge: "3-SEC INTERVAL",
  },
  {
    step: "02",
    stage: "ANALYZE",
    icon: "⬡",
    title: "Multi-Vector Correlation",
    text: "Heuristic and algorithmic engines correlate technical indicators into an instantaneous 0–100 cyber posture score.",
    badge: "HEURISTIC WEIGHTS",
  },
  {
    step: "03",
    stage: "TRANSLATE",
    icon: "₹",
    title: "Financial Exposure Modeling",
    text: "Translates abstract technical vulnerabilities into monetary business exposure: outage loss, downtime, and recovery in ₹.",
    badge: "MONETARY IMPACT",
  },
  {
    step: "04",
    stage: "AUTONOMOUS DEFENSE",
    icon: "⚡",
    title: "Automated Strategy & Remediation",
    text: "Simulates wargame outcomes, executes dynamic firewall drop rules, and terminates rogue processes with 1 click.",
    badge: "ACTIVE MITIGATION",
  },
];

export default function PipelineSection() {
  return (
    <section id="aura-pipeline" className="pipeline-section">
      <div className="pipeline-heading">
        <div className="section-eyebrow-chip">
          <span className="eyebrow-glow-dot"></span>
          <span>AUTONOMOUS PIPELINE ARCHITECTURE</span>
        </div>
        <h2>HOW AURA SENTINEL OPERATES</h2>
        <p className="pipeline-subtitle">
          Every recommendation and mitigation directive traces directly to continuous, real-time signals synthesized from your local hardware.
        </p>
      </div>

      <div className="pipeline-flow">
        {PIPELINE_STEPS.map((step, index) => (
          <div
            className="pipeline-node"
            key={step.stage}
            onMouseEnter={() => audioService.playClick()}
          >
            <div className="pipeline-node-header">
              <span className="pipeline-step-num">{step.step}</span>
              <div className="pipeline-node-marker">
                <span className="marker-icon">{step.icon}</span>
                <span>{step.stage}</span>
              </div>
            </div>

            <h4>{step.title}</h4>
            <p>{step.text}</p>

            <div className="pipeline-node-footer">
              <span className="pipeline-badge">{step.badge}</span>
            </div>

            {index < PIPELINE_STEPS.length - 1 && (
              <div className="pipeline-connector">
                <span className="connector-energy-pulse"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
