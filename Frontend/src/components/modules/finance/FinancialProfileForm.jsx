import React, { useState } from "react";
import { Sliders, Shield, TrendingUp, Zap, Clock, IndianRupee, Target } from "lucide-react";
import { audioService } from "../../../services/audioService";

export default function FinancialProfileForm({ profile, onProfileChange, onAnalyze, loading }) {
  const [amount, setAmount] = useState(profile.investment_amount || 100000);
  const [duration, setDuration] = useState(profile.duration_years || 3);
  const [risk, setRisk] = useState(profile.risk_profile || "moderate");
  const [liquidity, setLiquidity] = useState(profile.liquidity_requirement || "medium");
  const [goal, setGoal] = useState(profile.goal || "balanced_growth");
  const [formError, setFormError] = useState("");

  const handleAmountChange = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setAmount("");
    } else {
      setAmount(num);
      setFormError("");
    }
  };

  const setPresetAmount = (val) => {
    setAmount(val);
    audioService.playClick();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!amount || amount <= 0) {
      setFormError("Please enter a valid investment amount greater than zero.");
      return;
    }
    if (duration < 1 || duration > 40) {
      setFormError("Time horizon must be between 1 and 40 years.");
      return;
    }

    setFormError("");
    audioService.playCommand();

    const updatedProfile = {
      investment_amount: Number(amount),
      duration_years: Number(duration),
      risk_profile: risk,
      liquidity_requirement: liquidity,
      goal: goal,
    };

    onProfileChange(updatedProfile);
    if (onAnalyze) {
      onAnalyze(updatedProfile);
    }
  };

  return (
    <section className="finance-card profile-form-card">
      <div className="finance-card-header">
        <div className="card-title-group">
          <span className="card-eyebrow">STEP 01 // PREFERENCE SPECIFICATION</span>
          <h3>
            <Sliders size={16} className="header-icon" />
            INVESTOR PROFILE & PARAMETERS
          </h3>
        </div>
        <span className="card-badge">INTERACTIVE CONFIG</span>
      </div>

      <form onSubmit={handleSubmit} className="profile-form-body">
        {/* Investment Amount */}
        <div className="form-group">
          <label className="form-label">
            <IndianRupee size={13} />
            INVESTMENT PRINCIPAL (₹ INR)
          </label>
          <div className="amount-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="amount-input"
              placeholder="e.g. 100000"
            />
          </div>
          <div className="preset-buttons-row">
            {[25000, 50000, 100000, 250000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`btn-preset ${amount === preset ? "preset-active" : ""}`}
                onClick={() => setPresetAmount(preset)}
              >
                ₹{(preset / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Investment Duration Slider */}
        <div className="form-group">
          <div className="duration-label-row">
            <label className="form-label">
              <Clock size={13} />
              TIME HORIZON (YEARS)
            </label>
            <span className="duration-display">{duration} {duration === 1 ? "Year" : "Years"}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            className="range-slider"
          />
          <div className="slider-ticks">
            <span>1Y (Short)</span>
            <span>3Y (Medium)</span>
            <span>5Y (Long)</span>
            <span>10Y+ (Ultra)</span>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="form-group">
          <label className="form-label">
            <Shield size={13} />
            RISK TOLERANCE
          </label>
          <div className="selector-grid-3">
            {[
              { id: "conservative", title: "CONSERVATIVE", subtitle: "Low Volatility / Capital Safety" },
              { id: "moderate", title: "MODERATE", subtitle: "Balanced Growth & Controlled Risk" },
              { id: "aggressive", title: "AGGRESSIVE", subtitle: "High Variance / Cyclical Upside" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`choice-card ${risk === opt.id ? "choice-selected" : ""}`}
                onClick={() => {
                  setRisk(opt.id);
                  audioService.playClick();
                }}
              >
                <strong>{opt.title}</strong>
                <span>{opt.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Liquidity Requirement & Primary Goal */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">
              <Zap size={13} />
              LIQUIDITY REQUIREMENT
            </label>
            <div className="btn-group-pill">
              {["low", "medium", "high"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`pill-btn ${liquidity === item ? "pill-active" : ""}`}
                  onClick={() => {
                    setLiquidity(item);
                    audioService.playClick();
                  }}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Target size={13} />
              PRIMARY OBJECTIVE
            </label>
            <div className="btn-group-pill">
              {[
                { id: "capital_preservation", label: "PRESERVE" },
                { id: "balanced_growth", label: "BALANCED" },
                { id: "growth", label: "GROWTH" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`pill-btn ${goal === item.id ? "pill-active" : ""}`}
                  onClick={() => {
                    setGoal(item.id);
                    audioService.playClick();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {formError && <div className="form-error-banner">{formError}</div>}

        <button type="submit" disabled={loading} className="btn-analyze-submit">
          {loading ? (
            <span>COMPUTING ANALYTICAL SUITABILITY...</span>
          ) : (
            <>
              <TrendingUp size={15} />
              <span>EVALUATE SUITABILITY & MARKET SCENARIOS</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
