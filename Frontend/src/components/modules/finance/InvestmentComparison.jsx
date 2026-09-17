import React, { useState } from "react";
import { Scale, Landmark, LineChart, Shield, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

export default function InvestmentComparison({ comparisonData }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!comparisonData) {
    return null;
  }

  const gov = comparisonData.government_category || {};
  const mkt = comparisonData.market_category || {};

  return (
    <section className="finance-card comparison-card">
      <div className="finance-card-header">
        <div className="card-title-group">
          <span className="card-eyebrow">STEP 03 // CATEGORY ARBITRAGE</span>
          <h3>
            <Scale size={16} className="header-icon" />
            GOVERNMENT SECURITIES VS. MARKET-LINKED INSTRUMENTS
          </h3>
        </div>
        <div className="comparison-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            SIDE-BY-SIDE MATRIX
          </button>
          <button
            className={`tab-btn ${activeTab === "instruments" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("instruments")}
          >
            INSTRUMENT DECK
          </button>
        </div>
      </div>

      {activeTab === "overview" ? (
        <div className="comparison-matrix-grid">
          {/* Government Category Card */}
          <div className="category-deck-card deck-gov">
            <div className="deck-card-top">
              <div className="deck-title-area">
                <Landmark size={20} className="deck-icon gov-icon" />
                <div>
                  <h4>{gov.category_name || "Government Securities & Sovereign Instruments"}</h4>
                  <span className="deck-tag tag-sovereign">SOVEREIGN GUARANTEE</span>
                </div>
              </div>
            </div>

            <p className="deck-desc">{gov.description}</p>

            <div className="deck-attributes-list">
              <div className="attr-row">
                <span className="attr-name">Credit & Default Risk:</span>
                <strong className="attr-val-green">ZERO (Sovereign Backed)</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Historical Volatility:</span>
                <strong className="attr-val-cyan">{gov.annualized_volatility || "2.45% annualized (Low)"}</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Benchmark Yield:</span>
                <strong className="attr-val">{gov.benchmark_yield || "7.08% annualized"}</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Capital Stability Index:</span>
                <strong className="attr-val-green">{gov.stability_score || "94"}/100</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Max Historical Drawdown:</span>
                <strong className="attr-val-green">{gov.max_historical_drawdown || "2.15%"}</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Liquidity & Settlement:</span>
                <strong className="attr-val">{gov.liquidity_rating || "HIGH (T+1 Sovereign)"}</strong>
              </div>
            </div>

            <div className="deck-suitability-note note-gov">
              <CheckCircle2 size={14} className="note-icon" />
              <span>Optimal for capital preservation, predictable coupon flows, and conservative horizons.</span>
            </div>
          </div>

          {/* Market-Linked Category Card */}
          <div className="category-deck-card deck-market">
            <div className="deck-card-top">
              <div className="deck-title-area">
                <LineChart size={20} className="deck-icon market-icon" />
                <div>
                  <h4>{mkt.category_name || "Market-Linked Instruments & Broad Equities"}</h4>
                  <span className="deck-tag tag-equity">VARIABLE CAPITAL</span>
                </div>
              </div>
            </div>

            <p className="deck-desc">{mkt.description}</p>

            <div className="deck-attributes-list">
              <div className="attr-row">
                <span className="attr-name">Credit & Market Risk:</span>
                <strong className="attr-val-amber">MARKET & CYCLICAL EXPOSURE</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Historical Volatility:</span>
                <strong className="attr-val-amber">{mkt.annualized_volatility || "15.65% annualized (Elevated)"}</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Historical Benchmark:</span>
                <strong className="attr-val">{mkt.benchmark_return || "14.80% 5Y CAGR"}</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Capital Stability Index:</span>
                <strong className="attr-val-amber">{mkt.stability_score || "54"}/100</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Max Historical Drawdown:</span>
                <strong className="attr-val-red">{mkt.max_historical_drawdown || "28.40%"}</strong>
              </div>
              <div className="attr-row">
                <span className="attr-name">Liquidity & Settlement:</span>
                <strong className="attr-val-cyan">{mkt.liquidity_rating || "VERY HIGH (Intraday Exchange)"}</strong>
              </div>
            </div>

            <div className="deck-suitability-note note-market">
              <AlertTriangle size={14} className="note-icon" />
              <span>Higher historical returns paired with elevated volatility and periodic capital drawdowns.</span>
            </div>
          </div>
        </div>
      ) : (
        /* Instrument Deck View */
        <div className="instruments-deck-view">
          <div className="instruments-column">
            <h5 className="subdeck-title">
              <Landmark size={14} />
              SOVEREIGN-BACKED INSTRUMENTS
            </h5>
            <div className="instruments-cards-stack">
              {(gov.instruments || []).map((item, idx) => (
                <div key={idx} className="sub-instrument-card">
                  <div className="inst-header">
                    <span className="inst-symbol">{item.symbol}</span>
                    <span className="inst-yield">
                      {item.current_yield_pct ? `${item.current_yield_pct}% YTM` : `${item.coupon_rate_pct}%`}
                    </span>
                  </div>
                  <strong className="inst-name">{item.name}</strong>
                  <div className="inst-meta-row">
                    <span>Tenor: {item.tenor_type || `${item.duration_years}y`}</span>
                    <span>Vol: ~{item.volatility_pct}%</span>
                  </div>
                  <span className="inst-backing">{item.backing}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="instruments-column">
            <h5 className="subdeck-title">
              <LineChart size={14} />
              MARKET-LINKED INSTRUMENTS
            </h5>
            <div className="instruments-cards-stack">
              {(mkt.instruments || []).map((item, idx) => (
                <div key={idx} className="sub-instrument-card">
                  <div className="inst-header">
                    <span className="inst-symbol">{item.symbol}</span>
                    <span className="inst-return">~{item.indicative_return_5y_cagr}% 5Y CAGR</span>
                  </div>
                  <strong className="inst-name">{item.name}</strong>
                  <div className="inst-meta-row">
                    <span>Tenor: {item.tenor_type}</span>
                    <span>Beta: {item.beta}</span>
                    <span>Vol: ~{item.volatility_pct}%</span>
                  </div>
                  <span className="inst-backing">{item.backing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="comparison-bottom-banner">
        <p>
          <strong>ANALYTICAL NOTICE:</strong> {comparisonData.analytical_summary || "AURA presents comparative risk characteristics to facilitate user decision-making without automatic winner selection."}
        </p>
      </div>
    </section>
  );
}
