import React from "react";
import { Database, ShieldCheck, Activity, Radio, Shuffle, Clock } from "lucide-react";

export default function DataSourceStatus({ health, marketData }) {
  const isMock = health?.is_mock ?? marketData?.metadata?.is_mock ?? false;
  const failoverActive = health?.failover_active ?? marketData?.metadata?.failover_active ?? false;
  const providerName = health?.provider_name || marketData?.metadata?.data_source || "Alpha Vantage (Primary Live Feed)";
  const timestamp = health?.last_successful_update || marketData?.metadata?.timestamp;
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "LIVE";
  const volIndex = marketData?.metadata?.volatility_index || 14.2;
  const cacheSeconds = marketData?.metadata?.cache_seconds_remaining ?? health?.cache_seconds_remaining ?? 0;

  return (
    <div className="finance-status-banner">
      <div className="status-banner-left">
        <div className={`status-pill ${isMock ? "pill-demo" : "pill-live"}`}>
          <span className="pulsing-radar-dot"></span>
          <strong>{isMock ? "DEMO DATA MODE" : "LIVE FEED ACTIVE"}</strong>
        </div>

        {failoverActive && (
          <div className="status-pill pill-failover" title="Alpha Vantage request limit was reached; switched automatically to Twelve Data failover.">
            <Shuffle size={12} className="meta-icon text-amber-400" />
            <strong className="text-amber-400 text-xs">FAILOVER: TWELVE DATA</strong>
          </div>
        )}

        <div className="status-meta-item">
          <Database size={13} className="meta-icon" />
          <span className="meta-label">PROVIDER:</span>
          <span className="meta-value">{providerName}</span>
        </div>

        <div className="status-meta-item">
          <Activity size={13} className="meta-icon" />
          <span className="meta-label">LAST SYNC:</span>
          <span className="meta-value">{formattedTime}</span>
        </div>

        {cacheSeconds > 0 && (
          <div className="status-meta-item" title="TTL Cache active to conserve external API quotas">
            <Clock size={13} className="meta-icon text-blue-400" />
            <span className="meta-label">CACHE:</span>
            <span className="meta-value-cyan">{cacheSeconds}s</span>
          </div>
        )}

        <div className="status-meta-item">
          <Radio size={13} className="meta-icon" />
          <span className="meta-label">VOLATILITY (VIX):</span>
          <span className="meta-value-cyan">{volIndex.toFixed(1)}</span>
        </div>
      </div>

      <div className="status-banner-right">
        <div className="compliance-tag" title="AURA is an analytical decision-support system. It does not predict future returns or issue financial advice.">
          <ShieldCheck size={13} className="compliance-icon" />
          <span>DECISION SUPPORT ONLY • NOT FINANCIAL ADVICE</span>
        </div>
      </div>
    </div>
  );
}

