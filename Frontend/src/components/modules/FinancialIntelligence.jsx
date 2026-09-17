import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";
import DataSourceStatus from "./finance/DataSourceStatus";
import MarketOverview from "./finance/MarketOverview";
import FinancialProfileForm from "./finance/FinancialProfileForm";
import InvestmentComparison from "./finance/InvestmentComparison";
import SuitabilityCard from "./finance/SuitabilityCard";
import SimulationPanel from "./finance/SimulationPanel";
import FinancialExplanation from "./finance/FinancialExplanation";

export default function FinancialIntelligence() {
  const [health, setHealth] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [profile, setProfile] = useState({
    investment_amount: 100000,
    duration_years: 3,
    risk_profile: "moderate",
    liquidity_requirement: "medium",
    goal: "balanced_growth",
  });

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;

    const initializeFinanceData = async () => {
      try {
        setLoading(true);
        const [healthRes, marketRes, compareRes, analyzeRes, simRes] = await Promise.all([
          api.getFinanceHealth().catch(() => ({ is_mock: true, provider_name: "AURA Mock Provider (DEMO DATA)" })),
          api.getFinanceMarket().catch(() => null),
          api.compareFinanceCategories().catch(() => null),
          api.analyzeFinanceSuitability(profile).catch(() => null),
          api.simulateFinanceScenarios({
            initial_amount: profile.investment_amount,
            duration_years: profile.duration_years,
            selected_category: "government_backed",
          }).catch(() => null),
        ]);

        if (!isMounted) return;
        setHealth(healthRes);
        setMarketData(marketRes);
        setComparisonData(compareRes);
        setAnalysisData(analyzeRes);
        setSimulationData(simRes);
        setPageError("");
      } catch (err) {
        if (!isMounted) return;
        setPageError(`Failed to load financial intelligence telemetry: ${err.message}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeFinanceData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Profile Update & Re-Analysis
  const handleProfileAnalyze = async (newProfile) => {
    try {
      setLoading(true);
      setProfile(newProfile);

      // Persist profile to backend
      await api.saveFinanceProfile(newProfile).catch(() => null);

      // Run new suitability analysis and simulation in parallel
      const [analyzeRes, simRes] = await Promise.all([
        api.analyzeFinanceSuitability(newProfile),
        api.simulateFinanceScenarios({
          initial_amount: newProfile.investment_amount,
          duration_years: newProfile.duration_years,
          selected_category: newProfile.risk_profile === "aggressive" ? "market_linked" : "government_backed",
        }),
      ]);

      setAnalysisData(analyzeRes);
      setSimulationData(simRes);
      audioService.playAlert();
    } catch (err) {
      setPageError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Scenario Simulation Change
  const handleRunSimulation = async (simParams) => {
    try {
      setLoading(true);
      const res = await api.simulateFinanceScenarios(simParams);
      setSimulationData(res);
      audioService.playClick();
    } catch (err) {
      setPageError(`Simulation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="finance-intelligence-dashboard">
      {/* Header Banner */}
      <div className="finance-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL // MODULE 11</p>
          <h1>FINANCIAL INTELLIGENCE & MARKET ANALYSIS</h1>
          <p className="module-description">
            Objective quantitative evaluation and multi-scenario simulation comparing sovereign government instruments
            against market-linked investment categories.
          </p>
        </div>

        <div className="module-status-pill">
          <span className="pulse-indicator"></span>
          DECISION SUPPORT ACTIVE
        </div>
      </div>

      {/* Data Source & Compliance Status Banner */}
      <DataSourceStatus health={health} marketData={marketData} />

      {pageError && <div className="page-error-banner">{pageError}</div>}

      {/* Macro Market Overview */}
      <MarketOverview marketData={marketData} />

      {/* Top Layout: Profile Form + Suitability Card */}
      <div className="finance-two-column-layout">
        <FinancialProfileForm
          profile={profile}
          onProfileChange={setProfile}
          onAnalyze={handleProfileAnalyze}
          loading={loading}
        />

        <SuitabilityCard analysisData={analysisData} />
      </div>

      {/* Category Comparison Matrix */}
      <InvestmentComparison comparisonData={comparisonData} />

      {/* Scenario Simulator & Trajectory Graph */}
      <SimulationPanel
        simulationData={simulationData}
        onRunSimulation={handleRunSimulation}
        loading={loading}
      />

      {/* AI Synthesis & Regulatory Disclaimer */}
      <FinancialExplanation analysisData={analysisData} profile={profile} />
    </main>
  );
}
