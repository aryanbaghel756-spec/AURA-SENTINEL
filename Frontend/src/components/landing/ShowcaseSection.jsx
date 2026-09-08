import React from "react";
import NeuralField from "./NeuralField";
import { audioService } from "../../services/audioService";

const SHOWCASE_MODULES = [
  {
    id: "system-monitoring",
    num: "01",
    title: "System Monitoring",
    icon: "◉",
    desc: "Live CPU, memory, disk curves, and rogue process termination with protected system PID safety guards.",
    badge: "HARDWARE TELEMETRY",
    featured: false,
  },
  {
    id: "attack-surface",
    num: "02",
    title: "360° Attack Surface",
    icon: "◈",
    desc: "Interactive HTML5 canvas radar with 360-degree sweep, socket categories, and perimeter network mapping.",
    badge: "PORT RADAR",
    featured: true,
  },
  {
    id: "risk-intelligence",
    num: "03",
    title: "Risk Intelligence",
    icon: "⬡",
    desc: "Correlated 0–100 cyber risk score synthesized from live compute saturation and exposed listening sockets.",
    badge: "HEURISTIC MATRIX",
    featured: true,
  },
  {
    id: "financial-risk",
    num: "04",
    title: "Financial Risk Modeling",
    icon: "₹",
    desc: "Translates abstract vulnerabilities into actionable monetary exposure: hourly downtime loss in ₹.",
    badge: "BUSINESS IMPACT",
    featured: false,
  },
  {
    id: "what-if-engine",
    num: "05",
    title: "What-If & Wargame Sandbox",
    icon: "◐",
    desc: "Interactive stress-tuning sandbox and live attack simulation mode (Brute Force, DDoS, Recon) with 1-click mitigation.",
    badge: "SIH DEMO MODE",
    featured: true,
  },
  {
    id: "investment-optimizer",
    num: "06",
    title: "Investment Optimizer",
    icon: "◇",
    desc: "Algorithmically evaluates defense expenditures against organizational budget caps to maximize ROSI.",
    badge: "STRATEGY ROI",
    featured: false,
  },
  {
    id: "aura-voice",
    num: "07",
    title: "AURA Voice Assistant",
    icon: "🎙",
    desc: "Multilingual conversational AI companion (Hindi, Hinglish, English) powered by Groq LLM with holographic Arc Reactor.",
    badge: "VOICE AGENT",
    featured: true,
  },
  {
    id: "file-security",
    num: "08",
    title: "File Integrity & Safe Vault",
    icon: "▣",
    desc: "Deep inspection for sensitive leaked credentials, duplicate files, and junk with safe quarantine isolation.",
    badge: "SAFEGUARD",
    featured: false,
  },
  {
    id: "vision-intelligence",
    num: "09",
    title: "YOLOv8 Vision Optics",
    icon: "◎",
    desc: "Local webcam YOLOv8 person detection stream with targeting reticles, confidence meters, and HUD telemetry.",
    badge: "COMPUTER VISION",
    featured: false,
  },
];

export default function ShowcaseSection({ onInitialize }) {
  return (
    <section id="aura-showcase" className="modules-showcase">
      <div className="showcase-heading">
        <div className="showcase-field-wrapper">
          <NeuralField nodeCount={75} />
        </div>
        <div className="section-eyebrow-chip">
          <span className="eyebrow-glow-dot"></span>
          <span>NINE OPERATIONAL ENGINES</span>
        </div>
        <h2>ONE COHESIVE CYBER WORKSTATION</h2>
        <p className="showcase-sub">
          A full-spectrum defensive suite integrating continuous hardware surveillance, strategic planning, and automated threat mitigation.
        </p>
      </div>

      <div className="showcase-grid">
        {SHOWCASE_MODULES.map((module) => (
          <div
            key={module.id}
            className={`showcase-card ${module.featured ? "featured" : ""}`}
            onMouseEnter={() => audioService.playClick()}
          >
            <div className="showcase-card-header">
              <div className="showcase-num-icon">
                <span className="showcase-icon-symbol">{module.icon}</span>
                <span className="showcase-card-num">{module.num}</span>
              </div>
              <span className={`showcase-featured-badge ${module.featured ? "highlight" : ""}`}>
                {module.badge}
              </span>
            </div>

            <h3>{module.title}</h3>
            <p>{module.desc}</p>

            <div className="showcase-card-footer">
              <span className="card-explore-text">ENTER WORKSTATION</span>
              <span className="card-explore-arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="showcase-cta-wrapper">
        <button
          className="enter-button showcase-cta"
          onClick={() => {
            audioService.playActivation();
            onInitialize();
          }}
        >
          <span className="cta-icon">⚡</span>
          <span>INITIALIZE FULL CYBER WORKSTATION</span>
          <span className="button-arrow">→</span>
        </button>
      </div>
    </section>
  );
}
