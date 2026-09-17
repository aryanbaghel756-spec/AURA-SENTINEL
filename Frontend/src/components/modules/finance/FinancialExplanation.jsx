import React from "react";
import { Brain, ShieldAlert, Sparkles, AlertCircle, FileText } from "lucide-react";

export default function FinancialExplanation({ analysisData, profile }) {
  if (!analysisData) return null;

  const explanation = analysisData.analytical_explanation || "";
  const gov = analysisData.government_category || {};
  const mkt = analysisData.market_category || {};

  return (
    <section className="finance-card explanation-card">
      <div className="finance-card-header">
        <div className="card-title-group">
          <span className="card-eyebrow">STEP 06 // ANALYTICAL SYNTHESIS</span>
          <h3>
            <Brain size={16} className="header-icon" />
            AURA ANALYTICAL SYNTHESIS & FACTOR EXPLANATION
          </h3>
        </div>
        <span className="ai-status-badge">
          <Sparkles size={12} />
          METRIC-DRIVEN SYNTHESIS
        </span>
      </div>

      <div className="explanation-body">
        {/* Main Generated Explanation Box */}
        <div className="ai-speech-bubble">
          <p className="speech-text">{explanation}</p>
        </div>

        {/* Dynamic Factor Cards */}
        <div className="explanation-factors-grid">
          <div className="factor-detail-card">
            <span className="detail-tag tag-blue">DRAWDOWN BUFFER</span>
            <h4>Capital Protection Index</h4>
            <p>
              Government category reflects <strong>{gov.drawdown_indicator}</strong>, whereas market equities require endurance against <strong>{mkt.drawdown_indicator}</strong>.
            </p>
          </div>

          <div className="factor-detail-card">
            <span className="detail-tag tag-purple">HORIZON ALIGNMENT</span>
            <h4>Time Dimension Fit</h4>
            <p>
              With a <strong>{profile?.duration_years || 3}-year horizon</strong>, short-term volatility shocks are mitigated by higher stability weights (30%).
            </p>
          </div>

          <div className="factor-detail-card">
            <span className="detail-tag tag-green">SOVEREIGN COUPLING</span>
            <h4>Default Risk Insulation</h4>
            <p>
              Sovereign instruments carry <strong>zero credit default risk</strong>, providing principal insulation regardless of corporate macro stress.
            </p>
          </div>
        </div>

        {/* Compliance & Governance Footer */}
        <div className="compliance-statement-box">
          <FileText size={14} className="comp-icon" />
          <div>
            <strong>MANDATORY REGULATORY COMPLIANCE NOTICE:</strong>
            <p>
              This module operates strictly as an objective quantitative analysis and decision-support tool.
              It does not formulate personalized financial advice, issue solicitations, or guarantee investment returns.
              All final investment decisions and portfolio allocations remain exclusively at the discretion of the user.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
