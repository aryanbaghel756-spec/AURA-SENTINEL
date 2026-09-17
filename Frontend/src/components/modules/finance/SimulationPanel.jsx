import React, { useState } from "react";
import { TrendingUp, Play, RefreshCw, AlertCircle, Info, Landmark, LineChart, Layers } from "lucide-react";
import { audioService } from "../../../services/audioService";

export default function SimulationPanel({ simulationData, onRunSimulation, loading }) {
  const [selectedCat, setSelectedCat] = useState("government_backed");
  const [activeScenarioKey, setActiveScenarioKey] = useState("base");

  if (!simulationData) {
    return null;
  }

  const scenarios = simulationData.scenarios || {};
  const currentScenario = scenarios[activeScenarioKey] || scenarios.base || {};
  const trajectory = currentScenario.annual_trajectory || [];
  const terminal = currentScenario.terminal_summary || {};
  const initialAmount = simulationData.initial_amount || 50000;
  const durationYears = simulationData.duration_years || 3;

  const handleCategorySwitch = (catKey) => {
    setSelectedCat(catKey);
    audioService.playClick();
    if (onRunSimulation) {
      onRunSimulation({
        selected_category: catKey,
        initial_amount: initialAmount,
        duration_years: durationYears,
      });
    }
  };

  // Helper to compute SVG coordinates for the trajectory graph
  const maxVal = Math.max(
    ...trajectory.map((p) => Math.max(p.upper_bound, p.median_estimate, initialAmount * 1.5))
  );
  const minVal = Math.min(
    ...trajectory.map((p) => Math.min(p.lower_bound, p.median_estimate, initialAmount * 0.8))
  );

  const getSvgY = (val) => {
    const range = maxVal - minVal || 1;
    const norm = (val - minVal) / range;
    return 140 - norm * 110; // SVG canvas height 160 with margins
  };

  const getSvgX = (year) => {
    const total = durationYears || 1;
    return 40 + (year / total) * 440; // SVG canvas width 500
  };

  const medianPath = trajectory
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getSvgX(p.year)} ${getSvgY(p.median_estimate)}`)
    .join(" ");

  const upperPath = trajectory
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getSvgX(p.year)} ${getSvgY(p.upper_bound)}`)
    .join(" ");

  const lowerPath = trajectory
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getSvgX(p.year)} ${getSvgY(p.lower_bound)}`)
    .join(" ");

  return (
    <section className="finance-card simulation-card">
      <div className="finance-card-header">
        <div className="card-title-group">
          <span className="card-eyebrow">STEP 05 // MULTI-SCENARIO PROJECTION</span>
          <h3>
            <TrendingUp size={16} className="header-icon" />
            SCENARIO SIMULATOR & YEARLY TRAJECTORY
          </h3>
        </div>

        <div className="simulation-badge-group">
          <span className="illustrative-badge">
            <AlertCircle size={12} />
            ILLUSTRATIVE SIMULATION
          </span>
        </div>
      </div>

      {/* Category Selection Bar */}
      <div className="sim-category-bar">
        <span className="bar-label">SELECT ASSET CLASS:</span>
        <div className="sim-cat-buttons">
          {[
            { id: "government_backed", label: "GOVERNMENT SECURITIES", icon: <Landmark size={13} /> },
            { id: "market_linked", label: "MARKET-LINKED EQUITIES", icon: <LineChart size={13} /> },
            { id: "balanced_blend", label: "BALANCED ALLOCATION BLEND", icon: <Layers size={13} /> },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`sim-cat-btn ${selectedCat === cat.id ? "sim-cat-active" : ""}`}
              onClick={() => handleCategorySwitch(cat.id)}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Mode Switcher */}
      <div className="scenario-pills-row">
        {[
          { key: "conservative", title: "CONSERVATIVE SCENARIO", sub: "Adverse / Lower Tail" },
          { key: "base", title: "BASE SCENARIO", sub: "Historical Median Baseline" },
          { key: "high_volatility", title: "HIGH-VOLATILITY SCENARIO", sub: "Elevated Variance Dispersion" },
        ].map((s) => (
          <button
            key={s.key}
            type="button"
            className={`scenario-pill-btn ${activeScenarioKey === s.key ? "pill-selected" : ""}`}
            onClick={() => {
              setActiveScenarioKey(s.key);
              audioService.playClick();
            }}
          >
            <strong>{s.title}</strong>
            <span>{s.sub}</span>
          </button>
        ))}
      </div>

      {/* Trajectory SVG Visualizer */}
      <div className="trajectory-chart-container">
        <div className="chart-legend-header">
          <span className="legend-item legend-upper">--- Upper Bound</span>
          <span className="legend-item legend-median">── Projected Median</span>
          <span className="legend-item legend-lower">--- Lower Bound</span>
        </div>

        <svg viewBox="0 0 520 160" className="trajectory-svg">
          {/* Horizontal grid lines */}
          <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="40" y1="85" x2="480" y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.12)" />

          {/* Upper bound line */}
          <path d={upperPath} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" />

          {/* Lower bound line */}
          <path d={lowerPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" />

          {/* Median trajectory line */}
          <path d={medianPath} fill="none" stroke="#00f0ff" strokeWidth="2.5" />

          {/* Node dots */}
          {trajectory.map((p, idx) => (
            <g key={idx}>
              <circle cx={getSvgX(p.year)} cy={getSvgY(p.median_estimate)} r="3.5" fill="#00f0ff" />
              <text
                x={getSvgX(p.year)}
                y="155"
                textAnchor="middle"
                fill="#64748b"
                fontSize="9"
                fontFamily="JetBrains Mono"
              >
                Y{p.year}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Terminal Summary Cards */}
      <div className="terminal-summary-grid">
        <div className="terminal-stat-card">
          <span className="term-label">INITIAL PRINCIPAL</span>
          <strong className="term-value">₹{initialAmount.toLocaleString()}</strong>
          <span className="term-sub">Base Allocation</span>
        </div>

        <div className="terminal-stat-card card-highlight">
          <span className="term-label">PROJECTED MEDIAN (YEAR {durationYears})</span>
          <strong className="term-value-cyan">
            ₹{Math.round(terminal.projected_median || initialAmount).toLocaleString()}
          </strong>
          <span className="term-sub">
            Implied Growth: +{terminal.implied_absolute_growth_pct || 0}%
          </span>
        </div>

        <div className="terminal-stat-card">
          <span className="term-label">PROJECTED DISPERSION RANGE</span>
          <strong className="term-value-amber">{terminal.projected_range || "N/A"}</strong>
          <span className="term-sub">Lower Tail to Upper Tail</span>
        </div>

        <div className="terminal-stat-card">
          <span className="term-label">MODEL DRIFT & VOLATILITY</span>
          <strong className="term-value">
            {currentScenario.drift_rate_pct || 0}% / {currentScenario.assumed_volatility_pct || 0}% vol
          </strong>
          <span className="term-sub">{currentScenario.description}</span>
        </div>
      </div>

      <div className="simulation-disclaimer-box">
        <Info size={13} className="disc-icon" />
        <p>
          <strong>DISCLAIMER:</strong> {simulationData.disclaimer || "Mathematical model based on historical inputs. Historical performance does not guarantee future results."}
        </p>
      </div>
    </section>
  );
}
