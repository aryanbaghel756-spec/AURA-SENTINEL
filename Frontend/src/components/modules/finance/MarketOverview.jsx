import React from "react";
import { Activity, Landmark, LineChart, BarChart3, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MarketOverview({ marketData }) {
  if (!marketData) {
    return (
      <div className="finance-card loading-card">
        <div className="module-loader"></div>
        <span>FETCHING MACRO SOVEREIGN & MARKET TELEMETRY...</span>
      </div>
    );
  }

  const gov = marketData.government_category || {};
  const mkt = marketData.market_category || {};
  const volIndicators = marketData.volatility_indicators || {};
  const priceChanges = marketData.price_changes || {};
  const volumeData = marketData.liquidity_indicators || {};

  return (
    <section className="market-overview-section">
      <div className="section-title-bar">
        <div>
          <span className="card-eyebrow">STEP 02 // MACRO RECONNAISSANCE</span>
          <h3>
            <Activity size={16} className="header-icon" />
            LIVE MARKET STATUS & SOVEREIGN BENCHMARKS
          </h3>
        </div>
        <span className="live-pulse-badge">
          <span className="pulse-dot"></span>
          REAL-TIME TELEMETRY
        </span>
      </div>

      <div className="macro-metrics-grid">
        {/* 1. Sovereign 10Y Benchmark */}
        <div className="macro-stat-card sovereign-stat-card">
          <div className="stat-top">
            <span className="stat-label">
              <Landmark size={14} className="stat-icon" />
              10Y SOVEREIGN BENCHMARK
            </span>
            <span className="stat-tag tag-green">ZERO CREDIT RISK</span>
          </div>
          <div className="stat-main-val">
            <strong>{gov.benchmark_yield_pct?.toFixed(2) || "7.08"}%</strong>
            <span className="stat-sub">Yield to Maturity (YTM)</span>
          </div>
          <div className="stat-footer">
            <span className="change-pill pill-flat">
              <ArrowDownRight size={12} />
              {priceChanges.government_10y_yield_change_24h ?? -0.02}% (24h)
            </span>
            <span className="stat-meta-note">Volatility: {gov.annualized_volatility_pct || "2.45"}%</span>
          </div>
        </div>

        {/* 2. Market Equity Benchmark */}
        <div className="macro-stat-card equity-stat-card">
          <div className="stat-top">
            <span className="stat-label">
              <LineChart size={14} className="stat-icon" />
              BROAD MARKET EQUITY INDEX
            </span>
            <span className="stat-tag tag-cyan">MARKET-LINKED</span>
          </div>
          <div className="stat-main-val">
            <strong>{mkt.benchmark_annualized_return_pct?.toFixed(2) || "14.80"}%</strong>
            <span className="stat-sub">5Y Historical CAGR</span>
          </div>
          <div className="stat-footer">
            <span className="change-pill pill-up">
              <ArrowUpRight size={12} />
              +{priceChanges.market_equity_change_24h ?? 0.64}% (24h)
            </span>
            <span className="stat-meta-note">Max DD: ~{mkt.max_historical_drawdown_pct || "28.4"}%</span>
          </div>
        </div>

        {/* 3. Market Volatility Gauge (VIX) */}
        <div className="macro-stat-card vol-stat-card">
          <div className="stat-top">
            <span className="stat-label">
              <Activity size={14} className="stat-icon" />
              VOLATILITY REGIME (VIX)
            </span>
            <span className="stat-tag tag-amber">{volIndicators.regime || "LOW_TO_MODERATE"}</span>
          </div>
          <div className="stat-main-val">
            <strong>{volIndicators.market_volatility_index?.toFixed(2) || "13.8"}</strong>
            <span className="stat-sub">Annualized 30-Day Dispersion</span>
          </div>
          <div className="stat-footer">
            <span className="stat-meta-note">
              Sovereign Spread: {volIndicators.sovereign_credit_spread_bps || 42} bps
            </span>
          </div>
        </div>

        {/* 4. Secondary Market Turnover */}
        <div className="macro-stat-card volume-stat-card">
          <div className="stat-top">
            <span className="stat-label">
              <BarChart3 size={14} className="stat-icon" />
              SECONDARY MARKET LIQUIDITY
            </span>
            <span className="stat-tag tag-blue">DEEP ORDERBOOK</span>
          </div>
          <div className="stat-main-val">
            <strong>₹{(volumeData.gsec_secondary_volume_cr || 34850).toLocaleString()} Cr</strong>
            <span className="stat-sub">Daily Cleared Volume (T+1)</span>
          </div>
          <div className="stat-footer">
            <span className="stat-meta-note">
              Equity Turnover: ₹{(volumeData.market_equity_turnover_cr || 89420).toLocaleString()} Cr
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
