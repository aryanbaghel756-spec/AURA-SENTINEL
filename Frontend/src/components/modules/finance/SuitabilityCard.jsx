import React, { useState } from "react";
import { Award, Shield, CheckCircle2, Info, HelpCircle } from "lucide-react";

export default function SuitabilityCard({ analysisData }) {
  const [selectedCategory, setSelectedCategory] = useState("government");

  if (!analysisData) {
    return null;
  }

  const gov = analysisData.government_category || {};
  const mkt = analysisData.market_category || {};
  const weights = analysisData.weights || {};

  const current = selectedCategory === "government" ? gov : mkt;
  const score = current.suitability_score || 0;

  const getScoreColor = (val) => {
    if (val >= 80) return "#10b981"; // green
    if (val >= 60) return "#00f0ff"; // cyan
    if (val >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <section className="finance-card suitability-card">
      <div className="finance-card-header">
        <div className="card-title-group">
          <span className="card-eyebrow">STEP 04 // MULTI-FACTOR EVALUATION</span>
          <h3>
            <Award size={16} className="header-icon" />
            SUITABILITY ANALYSIS & COMPONENT BREAKDOWN
          </h3>
        </div>

        <div className="category-toggle-pill">
          <button
            className={`cat-toggle-btn ${selectedCategory === "government" ? "cat-active-gov" : ""}`}
            onClick={() => setSelectedCategory("government")}
          >
            🏛️ GOV SECURITIES ({gov.suitability_score || 0})
          </button>
          <button
            className={`cat-toggle-btn ${selectedCategory === "market" ? "cat-active-mkt" : ""}`}
            onClick={() => setSelectedCategory("market")}
          >
            📈 MARKET-LINKED ({mkt.suitability_score || 0})
          </button>
        </div>
      </div>

      <div className="suitability-main-grid">
        {/* Left: Score Gauge */}
        <div className="suitability-score-gauge-box">
          <div className="gauge-circle-container">
            <svg viewBox="0 0 120 120" className="gauge-svg">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="gauge-bg-circle"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                className="gauge-val-circle"
                stroke={getScoreColor(score)}
                strokeDasharray={`${(score / 100) * 314.15} 314.15`}
              />
            </svg>
            <div className="gauge-inner-content">
              <span className="gauge-number">{score.toFixed(1)}</span>
              <span className="gauge-sub">/ 100</span>
            </div>
          </div>

          <div className="gauge-label-group">
            <h4 style={{ color: getScoreColor(score) }}>
              {selectedCategory === "government" ? "SOVEREIGN SUITABILITY" : "MARKET SUITABILITY"}
            </h4>
            <span className="gauge-tag">
              {score >= 75 ? "STRONG PROFILE ALIGNMENT" : score >= 55 ? "BALANCED FIT" : "DIVERGENT RISK EXPOSURE"}
            </span>
          </div>
        </div>

        {/* Right: Breakdown Progress Bars */}
        <div className="suitability-breakdown-box">
          <div className="breakdown-header">
            <span className="breakdown-title">TRANSPARENT WEIGHTED BREAKDOWN</span>
            <span className="breakdown-formula">
              {weights.formula_display || "Score = (Risk 45%) + (Stability 30%) + (Liquidity 25%)"}
            </span>
          </div>

          {/* Factor 1: Risk Match (45%) */}
          <div className="factor-row">
            <div className="factor-labels">
              <span className="factor-name">
                <Shield size={13} className="factor-icon" />
                RISK PROFILE MATCH (45% WEIGHT)
              </span>
              <strong className="factor-pct">{current.risk_match?.toFixed(0)} / 100</strong>
            </div>
            <div className="factor-bar-track">
              <div
                className="factor-bar-fill fill-blue"
                style={{ width: `${current.risk_match || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Factor 2: Stability Score (30%) */}
          <div className="factor-row">
            <div className="factor-labels">
              <span className="factor-name">
                <CheckCircle2 size={13} className="factor-icon" />
                CAPITAL STABILITY INDEX (30% WEIGHT)
              </span>
              <strong className="factor-pct">{current.stability_score?.toFixed(0)} / 100</strong>
            </div>
            <div className="factor-bar-track">
              <div
                className="factor-bar-fill fill-green"
                style={{ width: `${current.stability_score || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Factor 3: Liquidity Score (25%) */}
          <div className="factor-row">
            <div className="factor-labels">
              <span className="factor-name">
                <Award size={13} className="factor-icon" />
                LIQUIDITY ALIGNMENT (25% WEIGHT)
              </span>
              <strong className="factor-pct">{current.liquidity_score?.toFixed(0)} / 100</strong>
            </div>
            <div className="factor-bar-track">
              <div
                className="factor-bar-fill fill-purple"
                style={{ width: `${current.liquidity_score || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="breakdown-math-note">
            <Info size={13} />
            <span>{current.breakdown_explanation}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
