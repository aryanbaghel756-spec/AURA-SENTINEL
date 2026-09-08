import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function InvestmentOptimizer() {
  const [investmentData, setInvestmentData] = useState(null);
  const [investmentError, setInvestmentError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formError, setFormError] = useState("");

  const [inputForm, setInputForm] = useState({
    business_type: "Small Business",
    monthly_budget: "50000",
    systems: "10",
    data_value: "500000",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const data = await api.getInvestmentOptimizer();
        if (!isMounted) return;
        setInvestmentData(data);
        setInvestmentError("");
      } catch {
        if (!isMounted) return;
        setInvestmentError("INVESTMENT OPTIMIZER SERVICE UNAVAILABLE");
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  const runAnalysis = async () => {
    const budget = Number(inputForm.monthly_budget);
    const systems = Number(inputForm.systems);
    const dataVal = Number(inputForm.data_value);

    if (!budget || budget <= 0 || !systems || systems <= 0 || !dataVal || dataVal <= 0) {
      setFormError("Please enter valid positive numbers for all parameters.");
      return;
    }

    setFormError("");
    setIsAnalyzing(true);

    try {
      const result = await api.analyzeInvestment({
        business_type: inputForm.business_type,
        monthly_budget: budget,
        systems: systems,
        data_value: dataVal,
      });
      setInvestmentData(result);
      setInvestmentError("");
    } catch {
      setFormError("Analysis execution failed. Please verify backend connectivity.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyBudgetPreset = (budget, systems, dataVal) => {
    setInputForm((prev) => ({
      ...prev,
      monthly_budget: String(budget),
      systems: String(systems),
      data_value: String(dataVal),
    }));
  };

  return (
    <main className="investment-dashboard">
      <div className="investment-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / SECURITY DECISION ENGINE</p>
          <h1>INVESTMENT OPTIMIZER</h1>
          <p className="investment-description">
            Algorithmic capital allocation engine. Evaluates your infrastructure against commercial defense tiers to recommend the investment strategy with the highest verified return on security investment (ROSI).
          </p>
        </div>

        <div className="investment-live-status">
          <span className="pulse-indicator"></span>
          DECISION ENGINE ONLINE
        </div>
      </div>

      {investmentError ? (
        <div className="connection-error">{investmentError}</div>
      ) : !investmentData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          EVALUATING DEFENSE PORTFOLIO OPTIONS...
        </div>
      ) : (
        <>
          {/* Input Parameters Section */}
          <section className="investment-input-section">
            <div className="investment-input-header">
              <div>
                <span className="process-eyebrow">ORGANIZATION PROFILE</span>
                <h2>CONFIGURE BUSINESS ENVIRONMENT</h2>
              </div>
              <p>Tune parameters below to recalculate risk reduction curves and projected ROI.</p>
            </div>

            <div className="budget-preset-bar">
              <span>PRESET PROFILES:</span>
              <button onClick={() => applyBudgetPreset(25000, 5, 200000)}>MICRO (₹25K)</button>
              <button onClick={() => applyBudgetPreset(50000, 15, 600000)}>GROWTH (₹50K)</button>
              <button onClick={() => applyBudgetPreset(150000, 50, 2500000)}>ENTERPRISE (₹1.5L)</button>
            </div>

            <div className="investment-input-grid">
              <div className="investment-input-field">
                <label>BUSINESS CATEGORY</label>
                <select
                  value={inputForm.business_type}
                  onChange={(e) => setInputForm({ ...inputForm, business_type: e.target.value })}
                >
                  <option value="Small Business">Small Business</option>
                  <option value="Startup">Startup / Tech</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Government Organization">Critical Infrastructure / Govt</option>
                </select>
              </div>

              <div className="investment-input-field">
                <label>MONTHLY DEFENSE BUDGET (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={inputForm.monthly_budget}
                  onChange={(e) => setInputForm({ ...inputForm, monthly_budget: e.target.value })}
                />
              </div>

              <div className="investment-input-field">
                <label>ACTIVE HOST COUNT (ENDPOINTS)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={inputForm.systems}
                  onChange={(e) => setInputForm({ ...inputForm, systems: e.target.value })}
                />
              </div>

              <div className="investment-input-field">
                <label>CRITICAL ASSET VALUE (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={inputForm.data_value}
                  onChange={(e) => setInputForm({ ...inputForm, data_value: e.target.value })}
                />
              </div>
            </div>

            {formError && <p className="soc-form-error">{formError}</p>}

            <button
              className="analyze-investment-btn"
              disabled={isAnalyzing}
              onClick={runAnalysis}
            >
              {isAnalyzing ? "CALCULATING PORTFOLIO METRICS..." : "⚡ RECALCULATE DEFENSE STRATEGY"}
            </button>
          </section>

          {/* Results Summary Section */}
          <section className="investment-results">
            <div className="investment-result-header">
              <div>
                <p className="process-eyebrow">AURA AUDIT OUTCOME</p>
                <h2>{investmentData.business_type} Security Architecture</h2>
              </div>
              <div className="live-risk-badge">
                LIVE RISK BENCHMARK: {investmentData.live_system_risk.risk_score} / 100
              </div>
            </div>

            <div className="investment-summary-grid">
              <div className="investment-summary-card">
                <span className="summary-label">LIVE RISK BENCHMARK</span>
                <h2 className="summary-val">{investmentData.live_system_risk.risk_score}/100</h2>
                <small>{investmentData.live_system_risk.open_ports} listening sockets bound</small>
              </div>

              <div className="investment-summary-card">
                <span className="summary-label">UNMITIGATED EXPOSURE</span>
                <h2 className="summary-val">₹{investmentData.current_financial_exposure.toLocaleString("en-IN")}</h2>
                <small>Baseline incident liability</small>
              </div>

              <div className="investment-summary-card">
                <span className="summary-label">OPTIMAL STRATEGY</span>
                <h2 className="summary-val accent">{investmentData.recommended_plan.name}</h2>
                <small>{investmentData.recommended_plan.risk_reduction}% vulnerability suppression</small>
              </div>
            </div>

            {/* Recommended Tier Card */}
            <div className="recommended-investment-card">
              <div className="recommendation-title">
                <div>
                  <p className="recommendation-kicker">AURA ALGORITHMIC RECOMMENDATION</p>
                  <h2>{investmentData.recommended_plan.name}</h2>
                </div>
                <div className="roi-badge">{investmentData.recommended_plan.roi_percent}% ESTIMATED ROSI</div>
              </div>

              <p className="recommendation-reason">{investmentData.recommendation_reason}</p>

              <div className="plan-metrics-grid">
                <div className="metric-box">
                  <span>MONTHLY INVESTMENT</span>
                  <strong>₹{investmentData.recommended_plan.cost.toLocaleString("en-IN")}</strong>
                </div>
                <div className="metric-box">
                  <span>GROSS SAVINGS</span>
                  <strong>₹{investmentData.recommended_plan.potential_savings.toLocaleString("en-IN")}</strong>
                </div>
                <div className="metric-box">
                  <span>NET BUSINESS BENEFIT</span>
                  <strong className="positive-benefit">₹{investmentData.recommended_plan.net_benefit.toLocaleString("en-IN")}</strong>
                </div>
                <div className="metric-box">
                  <span>RESIDUAL EXPOSURE</span>
                  <strong>₹{investmentData.recommended_plan.projected_exposure.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            {/* Tactical Directives */}
            <div className="defense-recommendation-card">
              <h3>CORE TACTICAL DIRECTIVES</h3>
              <div className="defense-list">
                {investmentData.defense_recommendations.map((item, index) => (
                  <div className="defense-item" key={index}>
                    <span className="defense-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* All Plans Comparison Matrix */}
          <section className="investment-plans-section">
            <div className="investment-section-header">
              <div>
                <span className="process-eyebrow">PORTFOLIO OPTIONS</span>
                <h2>DEFENSE TIER COMPARISON MATRIX</h2>
              </div>
            </div>

            <div className="investment-plan-grid">
              {investmentData.plans.map((plan) => {
                const isRecommended = plan.id === investmentData.recommended_plan.id;
                return (
                  <article
                    key={plan.id}
                    className={`investment-plan-card ${isRecommended ? "recommended" : ""}`}
                  >
                    {isRecommended && <div className="recommended-badge">OPTIMAL STRATEGY</div>}
                    <div className="plan-header">
                      <span className="plan-id">{plan.id.toUpperCase()} TIER</span>
                      <h3>{plan.name}</h3>
                    </div>

                    <div className="plan-cost">
                      <span>ALLOCATION</span>
                      <strong>₹{plan.cost.toLocaleString("en-IN")} / mo</strong>
                    </div>

                    <div className="plan-metrics">
                      <div>
                        <span>RISK SUPPRESSION</span>
                        <strong>{plan.risk_reduction}%</strong>
                      </div>
                      <div>
                        <span>ESTIMATED SAVINGS</span>
                        <strong>₹{plan.potential_savings.toLocaleString("en-IN")}</strong>
                      </div>
                      <div>
                        <span>NET BENEFIT</span>
                        <strong className={plan.net_benefit >= 0 ? "positive-value" : "negative-value"}>
                          ₹{plan.net_benefit.toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="plan-projected">
                      <span>RESIDUAL LIABILITY</span>
                      <strong>₹{plan.projected_exposure.toLocaleString("en-IN")}</strong>
                    </div>

                    <div className="plan-roi">
                      <span>ESTIMATED ROSI</span>
                      <strong>{plan.roi_percent}%</strong>
                    </div>

                    <div className="plan-features">
                      <span>INCLUDED CONTROLS</span>
                      <ul>
                        {plan.features.map((feature) => (
                          <li key={feature}>
                            <span className="feature-check">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
