import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  TrendingUp, 
  Coins, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export default function WhatIfSection() {
  // Scenario state sliders
  const [openPorts, setOpenPorts] = useState(6);
  const [threatSignals, setThreatSignals] = useState(4);
  const [systemLoad, setSystemLoad] = useState(55);
  const [edrActive, setEdrActive] = useState(false);
  const [mfaHardened, setMfaHardened] = useState(false);

  // Baseline fixed values
  const baselineRisk = 82;
  const baselineExposureMin = 8.0; // In Lakhs
  const baselineExposureMax = 15.0;

  // Real-time scenario recalculation
  const scenarioResults = useMemo(() => {
    // Port contribution: baseline has 4 ports
    const portDelta = (openPorts - 4) * 2.5;
    // Threat signals contribution: baseline has 3
    const threatDelta = (threatSignals - 3) * 3.2;
    // System load contribution: baseline ~45%
    const loadDelta = (systemLoad - 45) * 0.15;

    // Defense mitigations
    let mitigation = 0;
    if (edrActive) mitigation += 16;
    if (mfaHardened) mitigation += 10;

    let computedRisk = Math.round(baselineRisk + portDelta + threatDelta + loadDelta - mitigation);
    computedRisk = Math.max(15, Math.min(99, computedRisk));

    // Financial scaling factor
    const ratio = computedRisk / baselineRisk;
    const computedMin = (baselineExposureMin * ratio).toFixed(1);
    const computedMax = (baselineExposureMax * ratio).toFixed(1);

    const riskDelta = computedRisk - baselineRisk;
    const exposureDelta = (Number(computedMin) - baselineExposureMin).toFixed(1);

    return {
      riskScore: computedRisk,
      exposureMin: computedMin,
      exposureMax: computedMax,
      riskDelta,
      exposureDelta
    };
  }, [openPorts, threatSignals, systemLoad, edrActive, mfaHardened]);

  return (
    <section id="whatif" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Sliders className="w-3.5 h-3.5" />
            <span>WARGAME SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            WHAT IF THE THREAT LANDSCAPE CHANGES?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Interactively stress-test your defensive posture against hypothetical zero-days, resource exhaustion, and attack vectors
          </p>
        </div>

        {/* INTERACTIVE WARGAME WORKBENCH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Scenario Controls */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-3">
              <span className="text-sm font-bold font-mono text-white uppercase">
                SCENARIO PARAMETER CONTROLS
              </span>
              <button
                onClick={() => {
                  setOpenPorts(6);
                  setThreatSignals(4);
                  setSystemLoad(55);
                  setEdrActive(false);
                  setMfaHardened(false);
                }}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            </div>

            {/* Control 1: Open Ports */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Exposed Network Ports:</span>
                <strong className="text-cyan-400">{openPorts} Ports Open</strong>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                value={openPorts}
                onChange={(e) => setOpenPorts(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>2 (Hardened)</span>
                <span>8 (Enterprise Typical)</span>
                <span>24 (Highly Exposed)</span>
              </div>
            </div>

            {/* Control 2: Threat Signals */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Anomalous Threat Signals:</span>
                <strong className="text-amber-400">{threatSignals} Signal Clusters</strong>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={threatSignals}
                onChange={(e) => setThreatSignals(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 (Quiet Baseline)</span>
                <span>6 (Active Recon)</span>
                <span>12 (Severe Infiltration)</span>
              </div>
            </div>

            {/* Control 3: System Resource Load */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Compute &amp; Memory Saturation:</span>
                <strong className="text-sky-400">{systemLoad}% Utilization</strong>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                value={systemLoad}
                onChange={(e) => setSystemLoad(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>15% (Nominal)</span>
                <span>60% (Moderate)</span>
                <span>100% (Resource Exhaustion)</span>
              </div>
            </div>

            {/* Control 4: Active Defense Mitigations */}
            <div className="pt-2 border-t border-[#1F2E4D] space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase block">
                Active Mitigating Controls:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setEdrActive(!edrActive)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                    edrActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                      : 'bg-[#16213A] text-slate-400 border-[#1F2E4D] hover:border-slate-600'
                  }`}
                >
                  <span>EDR Active (-16 Risk)</span>
                  {edrActive ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                </button>

                <button
                  onClick={() => setMfaHardened(!mfaHardened)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                    mfaHardened
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                      : 'bg-[#16213A] text-slate-400 border-[#1F2E4D] hover:border-slate-600'
                  }`}
                >
                  <span>MFA Enforced (-10 Risk)</span>
                  {mfaHardened ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Before vs After Live Comparison */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CURRENT STATE CARD */}
              <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                    CURRENT STATE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Live Baseline
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400">RISK SCORE</div>
                  <div className="text-3xl font-black font-mono text-white mt-0.5">
                    {baselineRisk} <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400">FINANCIAL EXPOSURE</div>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                    ₹{baselineExposureMin}L – ₹{baselineExposureMax}L
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-[#1F2E4D]">
                  Measured from 14 operational telemetry sensors
                </div>
              </div>

              {/* SCENARIO STATE CARD */}
              <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
                scenarioResults.riskDelta > 0
                  ? 'bg-rose-950/20 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
                  : 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
              }`}>
                <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-2">
                  <span className="text-xs font-mono text-cyan-300 uppercase font-bold">
                    SCENARIO STATE
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    scenarioResults.riskDelta > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {scenarioResults.riskDelta > 0 ? `+${scenarioResults.riskDelta} Points` : `${scenarioResults.riskDelta} Points`}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400">SIMULATED RISK SCORE</div>
                  <div className={`text-3xl font-black font-mono mt-0.5 ${
                    scenarioResults.riskScore > 80 ? 'text-rose-400' : 'text-cyan-300'
                  }`}>
                    {scenarioResults.riskScore} <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400">SIMULATED EXPOSURE</div>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                    ₹{scenarioResults.exposureMin}L – ₹{scenarioResults.exposureMax}L
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1F2E4D]">
                  Projected Shift: <strong>{scenarioResults.riskDelta > 0 ? `+₹${scenarioResults.exposureDelta}L Exposure` : `${scenarioResults.exposureDelta}L Exposure`}</strong>
                </div>
              </div>

            </div>

            {/* MANDATORY DISCLAIMER NOTE */}
            <div className="p-4 rounded-xl bg-[#080D18] border border-amber-500/30 flex items-start space-x-3 text-xs font-mono text-amber-200/90">
              <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <strong>Notice:</strong> Scenario outputs are model-based simulations designed for proactive executive decision modeling. They do not constitute guaranteed future loss claims.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
