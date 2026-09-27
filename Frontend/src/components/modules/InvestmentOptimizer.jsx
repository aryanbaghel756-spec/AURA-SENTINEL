import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function InvestmentOptimizer() {
  const [investmentData, setInvestmentData] = useState(null);
  const [investmentError, setInvestmentError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formError, setFormError] = useState("");

  // Input form state
  const [inputForm, setInputForm] = useState({
    business_type: "Small Business",
    monthly_budget: "500000",
    systems: "15",
    data_value: "1000000",
  });

  // Dedicated 0/1 Knapsack state
  const [knapsackData, setKnapsackData] = useState(null);
  const [knapsackBudget, setKnapsackBudget] = useState(500000);
  const [isKnapsackRunning, setIsKnapsackRunning] = useState(false);
  const [controlFilter, setControlFilter] = useState("all"); // "all" | "selected" | "excluded"

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const data = await api.getInvestmentOptimizer();
        if (!isMounted) return;
        setInvestmentData(data);
        if (data.knapsack_optimization) {
          setKnapsackData(data.knapsack_optimization);
          setKnapsackBudget(data.knapsack_optimization.budget || 500000);
        }
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
      if (result.knapsack_optimization) {
        setKnapsackData(result.knapsack_optimization);
        setKnapsackBudget(result.knapsack_optimization.budget || budget);
      }
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
    triggerKnapsackOptimization(budget);
  };

  const triggerKnapsackOptimization = async (budgetVal) => {
    const numericBudget = Math.max(0, Number(budgetVal));
    setKnapsackBudget(numericBudget);
    setIsKnapsackRunning(true);

    try {
      const exposure = investmentData?.current_financial_exposure || 1250000;
      const res = await api.optimizeKnapsack({
        budget: numericBudget,
        current_exposure: exposure,
        business_type: inputForm.business_type,
      });
      setKnapsackData(res);
    } catch (err) {
      console.error("Knapsack optimization failed:", err);
    } finally {
      setIsKnapsackRunning(false);
    }
  };

  // Combine selected and excluded for the catalog view
  const allControls = React.useMemo(() => {
    if (!knapsackData) return [];
    const sel = (knapsackData.selected_investments || []).map((c) => ({ ...c, isSelected: true }));
    const exc = (knapsackData.excluded_investments || []).map((c) => ({ ...c, isSelected: false }));
    return [...sel, ...exc];
  }, [knapsackData]);

  const filteredControls = React.useMemo(() => {
    if (controlFilter === "selected") return allControls.filter((c) => c.isSelected);
    if (controlFilter === "excluded") return allControls.filter((c) => !c.isSelected);
    return allControls;
  }, [allControls, controlFilter]);

  return (
    <main className="investment-dashboard">
      <div className="investment-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / SECURITY DECISION ENGINE</p>
          <h1>INVESTMENT OPTIMIZER</h1>
          <p className="investment-description">
            Continuous actuarial capital allocation powered by a genuine <strong>0/1 Knapsack Dynamic Programming</strong> engine.
            Mathematically maximizes technical risk reduction within your exact enterprise budget constraint.
          </p>
        </div>

        <div className="investment-live-status">
          <span className="pulse-indicator"></span>
          0/1 KNAPSACK DP ONLINE
        </div>
      </div>

      {investmentError ? (
        <div className="connection-error">{investmentError}</div>
      ) : !investmentData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          INITIALIZING DYNAMIC PROGRAMMING MATRICES...
        </div>
      ) : (
        <>
          {/* ========================================================
              0/1 KNAPSACK BUDGET OPTIMIZER CORE SECTION
              ======================================================== */}
          {knapsackData && (
            <section className="knapsack-optimizer-card">
              <div className="knapsack-header">
                <div className="knapsack-title-area">
                  <span className="process-eyebrow">ACTUARIAL MATHEMATICAL CORE</span>
                  <h2>
                    <span>🎯</span> 0/1 KNAPSACK BUDGET OPTIMIZER
                  </h2>
                  <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "13px" }}>
                    Solves the discrete bounded 0/1 Knapsack problem using dynamic programming table state transitions and backtracking.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  <div className="knapsack-algo-badge">
                    <span>⚡</span> 0/1 KNAPSACK DYNAMIC PROGRAMMING
                  </div>
                  <div className="knapsack-constraint-badge">
                    <span>🔒</span> CONSTRAINT: COST ≤ BUDGET | NON-FRACTIONAL
                  </div>
                </div>
              </div>

              {/* Visual Pipeline Flow Diagram */}
              <div className="knapsack-pipeline-diagram">
                <div className="knapsack-pipeline-step">
                  <span className="knapsack-step-tag">Step 1 • Input</span>
                  <span className="knapsack-step-title">AVAILABLE BUDGET</span>
                  <small style={{ color: "#38BDF8", fontWeight: 700 }}>₹{knapsackData.budget?.toLocaleString("en-IN")}</small>
                </div>

                <div className="knapsack-pipeline-arrow">➔</div>

                <div className="knapsack-pipeline-step">
                  <span className="knapsack-step-tag">Step 2 • Universe</span>
                  <span className="knapsack-step-title">CANDIDATE CONTROLS</span>
                  <small style={{ color: "#94A3B8" }}>{allControls.length} Defense Controls</small>
                </div>

                <div className="knapsack-pipeline-arrow">➔</div>

                <div className="knapsack-pipeline-core">
                  <span className="knapsack-step-tag" style={{ color: "#22D3EE" }}>Step 3 • DP Optimization</span>
                  <strong>0/1 KNAPSACK DP ENGINE</strong>
                  <small>Maximize Risk Reduction | Cost ≤ Budget | Selection ∈ {'{0, 1}'}</small>
                </div>

                <div className="knapsack-pipeline-arrow">➔</div>

                <div className="knapsack-pipeline-step">
                  <span className="knapsack-step-tag">Step 4 • Output</span>
                  <span className="knapsack-step-title">OPTIMAL PORTFOLIO</span>
                  <small style={{ color: "#34D399", fontWeight: 700 }}>{knapsackData.selected_investments?.length} Selected Controls</small>
                </div>
              </div>

              {/* KPI Metrics Summary Grid */}
              <div className="knapsack-metrics-grid">
                <div className="knapsack-metric-card accent-cyan">
                  <span>AVAILABLE BUDGET</span>
                  <strong>₹{knapsackData.budget?.toLocaleString("en-IN")}</strong>
                  <small>Allocated capital ceiling</small>
                </div>

                <div className="knapsack-metric-card accent-emerald">
                  <span>OPTIMIZED INVESTMENT</span>
                  <strong>₹{knapsackData.total_cost?.toLocaleString("en-IN")}</strong>
                  <small>{knapsackData.selected_investments?.length} Controls Selected</small>
                </div>

                <div className="knapsack-metric-card accent-amber">
                  <span>REMAINING BUDGET</span>
                  <strong>₹{knapsackData.remaining_budget?.toLocaleString("en-IN")}</strong>
                  <small>Preserved cash reserve</small>
                </div>

                <div className="knapsack-metric-card accent-emerald">
                  <span>PROJECTED RISK REDUCTION</span>
                  <strong>+{knapsackData.total_risk_reduction}%</strong>
                  <small>Modeled exposure suppression</small>
                </div>

                <div className="knapsack-metric-card accent-violet">
                  <span>RESIDUAL EXPOSURE</span>
                  <strong>₹{knapsackData.projected_exposure?.toLocaleString("en-IN")}</strong>
                  <small>ROSI: {knapsackData.rosi_percent}%</small>
                </div>
              </div>

              {/* Interactive Budget Controller (What-If Integration) */}
              <div className="knapsack-controller">
                <div className="knapsack-controller-header">
                  <div>
                    <span className="process-eyebrow">WHAT-IF BUDGET SCENARIO SIMULATOR</span>
                    <h3>DYNAMICALLY ADJUST SECURITY BUDGET</h3>
                  </div>
                  <div className="knapsack-presets-row">
                    <button
                      className={`knapsack-preset-btn ${knapsackBudget === 100000 ? "active" : ""}`}
                      onClick={() => triggerKnapsackOptimization(100000)}
                    >
                      ₹1 LAKH
                    </button>
                    <button
                      className={`knapsack-preset-btn ${knapsackBudget === 300000 ? "active" : ""}`}
                      onClick={() => triggerKnapsackOptimization(300000)}
                    >
                      ₹3 LAKH
                    </button>
                    <button
                      className={`knapsack-preset-btn ${knapsackBudget === 500000 ? "active" : ""}`}
                      onClick={() => triggerKnapsackOptimization(500000)}
                    >
                      ₹5 LAKH (RECOMMENDED)
                    </button>
                    <button
                      className={`knapsack-preset-btn ${knapsackBudget === 800000 ? "active" : ""}`}
                      onClick={() => triggerKnapsackOptimization(800000)}
                    >
                      ₹8 LAKH
                    </button>
                    <button
                      className={`knapsack-preset-btn ${knapsackBudget === 1200000 ? "active" : ""}`}
                      onClick={() => triggerKnapsackOptimization(1200000)}
                    >
                      ₹12 LAKH
                    </button>
                  </div>
                </div>

                <div className="knapsack-slider-box">
                  <input
                    type="range"
                    className="knapsack-slider"
                    min="25000"
                    max="1500000"
                    step="25000"
                    value={knapsackBudget}
                    onChange={(e) => triggerKnapsackOptimization(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="knapsack-input-num"
                    value={knapsackBudget}
                    onChange={(e) => triggerKnapsackOptimization(Number(e.target.value))}
                  />
                  <button
                    className="knapsack-preset-btn active"
                    style={{ padding: "8px 16px" }}
                    disabled={isKnapsackRunning}
                    onClick={() => triggerKnapsackOptimization(knapsackBudget)}
                  >
                    {isKnapsackRunning ? "SOLVING DP..." : "⚡ RECALCULATE DP"}
                  </button>
                </div>
              </div>

              {/* Controls Filter Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className={`knapsack-preset-btn ${controlFilter === "all" ? "active" : ""}`}
                    onClick={() => setControlFilter("all")}
                  >
                    ALL CANDIDATE CONTROLS ({allControls.length})
                  </button>
                  <button
                    className={`knapsack-preset-btn ${controlFilter === "selected" ? "active" : ""}`}
                    onClick={() => setControlFilter("selected")}
                  >
                    ✓ SELECTED IN PORTFOLIO ({knapsackData.selected_investments?.length || 0})
                  </button>
                  <button
                    className={`knapsack-preset-btn ${controlFilter === "excluded" ? "active" : ""}`}
                    onClick={() => setControlFilter("excluded")}
                  >
                    ✕ EXCLUDED ({knapsackData.excluded_investments?.length || 0})
                  </button>
                </div>
                <small style={{ color: "#94A3B8" }}>
                  Discretization Resolution: ₹{knapsackData.scaling_unit_inr || 1000} per DP Unit
                </small>
              </div>

              {/* Controls Catalog Grid */}
              <div className="knapsack-items-grid">
                {filteredControls.map((control) => (
                  <div
                    key={control.id}
                    className={`knapsack-item-card ${control.isSelected ? "selected" : "excluded"}`}
                  >
                    <div className="knapsack-item-top">
                      <span className="knapsack-item-category">{control.category}</span>
                      {control.isSelected ? (
                        <span className="knapsack-item-badge-sel">✓ SELECTED (0/1 DP)</span>
                      ) : (
                        <span className="knapsack-item-badge-exc">✕ EXCLUDED</span>
                      )}
                    </div>

                    <h4>{control.name}</h4>
                    <p className="knapsack-item-desc">{control.description}</p>

                    <div className="knapsack-item-footer">
                      <div>
                        <span style={{ fontSize: "10px", color: "#64748B", display: "block" }}>COST ALLOCATION</span>
                        <strong className="knapsack-item-cost">₹{control.cost.toLocaleString("en-IN")}</strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "10px", color: "#64748B", display: "block" }}>RISK MITIGATION</span>
                        <span className="knapsack-item-gain">+{control.risk_reduction} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Explainability Section */}
              <div className="knapsack-explain-box">
                <h4>💡 EXPLAINABILITY: WHY WERE THESE CONTROLS SELECTED?</h4>
                <ul>
                  <li>
                    <span className="knapsack-bullet">✓</span>
                    <span>
                      <strong>Global Optimality:</strong> Selected because this combination provides the mathematically highest combined modeled risk reduction (<strong>+{knapsackData.total_risk_reduction} points</strong>) achievable within the specified <strong>₹{knapsackData.budget?.toLocaleString("en-IN")}</strong> budget ceiling.
                    </span>
                  </li>
                  <li>
                    <span className="knapsack-bullet">✓</span>
                    <span>
                      <strong>Budget Compliance:</strong> Total investment allocation of <strong>₹{knapsackData.total_cost?.toLocaleString("en-IN")}</strong> strictly never exceeds the budget, leaving <strong>₹{knapsackData.remaining_budget?.toLocaleString("en-IN")}</strong> in reserve capital.
                    </span>
                  </li>
                  <li>
                    <span className="knapsack-bullet">✓</span>
                    <span>
                      <strong>0/1 Binary Non-Fractional Decision:</strong> Each candidate security control was evaluated under discrete 0/1 logic (selected at most once, non-fractional, zero duplication).
                    </span>
                  </li>
                  <li>
                    <span className="knapsack-bullet">✓</span>
                    <span>
                      <strong>Defensible Audit Log:</strong> Every optimization decision is recorded with a cryptographic block on the local AURA Merkle Blockchain Ledger.
                    </span>
                  </li>
                </ul>
                <span className="knapsack-disclaimer">
                  * Note: Optimal among the configured candidate controls under the specified budget and modeled risk parameters.
                </span>
              </div>
            </section>
          )}

          {/* ========================================================
              ORGANIZATION PROFILE & DEFENSE TIER BENCHMARKS (PRESERVED)
              ======================================================== */}
          <section className="investment-input-section">
            <div className="investment-input-header">
              <div>
                <span className="process-eyebrow">ORGANIZATION PROFILE</span>
                <h2>CONFIGURE BUSINESS ENVIRONMENT</h2>
              </div>
              <p>Tune parameters below to recalculate risk reduction curves and projected ROI across commercial tiers.</p>
            </div>

            <div className="budget-preset-bar">
              <span>COMMERCIAL PROFILES:</span>
              <button onClick={() => applyBudgetPreset(100000, 5, 500000)}>MICRO (₹1L)</button>
              <button onClick={() => applyBudgetPreset(300000, 15, 1200000)}>GROWTH (₹3L)</button>
              <button onClick={() => applyBudgetPreset(500000, 30, 2500000)}>ENTERPRISE (₹5L)</button>
              <button onClick={() => applyBudgetPreset(1000000, 60, 5000000)}>MEGA (₹10L)</button>
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
                  placeholder="e.g. 500000"
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
                  placeholder="e.g. 1000000"
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
                LIVE RISK BENCHMARK: {investmentData.live_system_risk?.risk_score} / 100
              </div>
            </div>

            <div className="investment-summary-grid">
              <div className="investment-summary-card">
                <span className="summary-label">LIVE RISK BENCHMARK</span>
                <h2 className="summary-val">{investmentData.live_system_risk?.risk_score}/100</h2>
                <small>{investmentData.live_system_risk?.open_ports} listening sockets bound</small>
              </div>

              <div className="investment-summary-card">
                <span className="summary-label">UNMITIGATED EXPOSURE</span>
                <h2 className="summary-val">₹{investmentData.current_financial_exposure?.toLocaleString("en-IN")}</h2>
                <small>Baseline incident liability</small>
              </div>

              <div className="investment-summary-card">
                <span className="summary-label">OPTIMAL STRATEGY</span>
                <h2 className="summary-val accent">{investmentData.recommended_plan?.name}</h2>
                <small>{investmentData.recommended_plan?.risk_reduction}% vulnerability suppression</small>
              </div>
            </div>

            {/* Recommended Tier Card */}
            {investmentData.recommended_plan && (
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
                    <strong>₹{investmentData.recommended_plan.cost?.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="metric-box">
                    <span>GROSS SAVINGS</span>
                    <strong>₹{investmentData.recommended_plan.potential_savings?.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="metric-box">
                    <span>NET BUSINESS BENEFIT</span>
                    <strong className="positive-benefit">₹{investmentData.recommended_plan.net_benefit?.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="metric-box">
                    <span>RESIDUAL EXPOSURE</span>
                    <strong>₹{investmentData.recommended_plan.projected_exposure?.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tactical Directives */}
            {investmentData.defense_recommendations && (
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
            )}
          </section>

          {/* All Plans Comparison Matrix */}
          {investmentData.plans && (
            <section className="investment-plans-section">
              <div className="investment-section-header">
                <div>
                  <span className="process-eyebrow">PORTFOLIO OPTIONS</span>
                  <h2>COMMERCIAL DEFENSE TIER MATRIX</h2>
                </div>
              </div>

              <div className="investment-plan-grid">
                {investmentData.plans.map((plan) => {
                  const isRecommended = plan.id === investmentData.recommended_plan?.id;
                  return (
                    <article
                      key={plan.id}
                      className={`investment-plan-card ${isRecommended ? "recommended" : ""}`}
                    >
                      {isRecommended && <div className="recommended-badge">RECOMMENDED TIER</div>}
                      <div className="plan-header">
                        <span className="plan-id">{plan.id.toUpperCase()} TIER</span>
                        <h3>{plan.name}</h3>
                      </div>

                      <div className="plan-cost">
                        <span>ALLOCATION</span>
                        <strong>₹{plan.cost?.toLocaleString("en-IN")} / mo</strong>
                      </div>

                      <div className="plan-metrics">
                        <div>
                          <span>RISK SUPPRESSION</span>
                          <strong>{plan.risk_reduction}%</strong>
                        </div>
                        <div>
                          <span>ESTIMATED SAVINGS</span>
                          <strong>₹{plan.potential_savings?.toLocaleString("en-IN")}</strong>
                        </div>
                        <div>
                          <span>NET BENEFIT</span>
                          <strong className={plan.net_benefit >= 0 ? "positive-value" : "negative-value"}>
                            ₹{plan.net_benefit?.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </div>

                      <div className="plan-projected">
                        <span>RESIDUAL LIABILITY</span>
                        <strong>₹{plan.projected_exposure?.toLocaleString("en-IN")}</strong>
                      </div>

                      <div className="plan-roi">
                        <span>ESTIMATED ROSI</span>
                        <strong>{plan.roi_percent}%</strong>
                      </div>

                      <div className="plan-features">
                        <span>INCLUDED CONTROLS</span>
                        <ul>
                          {plan.features?.map((feature) => (
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
          )}
        </>
      )}
    </main>
  );
}
