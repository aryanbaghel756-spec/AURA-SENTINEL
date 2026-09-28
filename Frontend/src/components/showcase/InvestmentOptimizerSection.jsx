import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  ShieldCheck,
  Info,
  Sliders
} from 'lucide-react';

export default function InvestmentOptimizerSection() {
  const [budget, setBudget] = useState(1000000); // Default ₹10,00,000

  // The 8 candidate defensive controls with real costs and modeled risk values
  const candidateControls = [
    {
      id: 'EDR',
      name: 'EDR & Endpoint Behavioral Guard',
      cost: 350000,
      riskReduction: 24,
      category: 'Endpoint Security',
      description: 'Heuristic anomaly detection on process execution and memory injection.'
    },
    {
      id: 'NET_MON',
      name: 'Deep Network Traffic Inspection',
      cost: 250000,
      riskReduction: 18,
      category: 'Perimeter Defense',
      description: 'Flow analysis and ingress/egress anomaly detection across internal subnets.'
    },
    {
      id: 'DLP',
      name: 'Enterprise Data Loss Prevention',
      cost: 200000,
      riskReduction: 14,
      category: 'Data Governance',
      description: 'Automated content inspection and outbound exfiltration blocking.'
    },
    {
      id: 'VULN_MGMT',
      name: 'Continuous Vulnerability Scanner',
      cost: 150000,
      riskReduction: 12,
      category: 'Threat Assessment',
      description: 'Automated CVE scanning and listening port weakness discovery.'
    },
    {
      id: 'IAM_MFA',
      name: 'Zero-Trust IAM & Hardened MFA',
      cost: 200000,
      riskReduction: 16,
      category: 'Identity & Access',
      description: 'Strict hardware-token MFA and context-aware session authorization.'
    },
    {
      id: 'BCDR',
      name: 'Immutable Air-Gapped BCDR Backup',
      cost: 300000,
      riskReduction: 20,
      category: 'Resilience',
      description: 'WORM (Write Once Read Many) snapshot retention against ransomware.'
    },
    {
      id: 'SIEM_INTEL',
      name: 'SIEM & SOC Threat Feed Integration',
      cost: 180000,
      riskReduction: 15,
      category: 'SOC Intelligence',
      description: 'Real-time MITRE ATT&CK correlation with commercial threat feeds.'
    },
    {
      id: 'SEC_TRAIN',
      name: 'Automated Phishing Defense Simulator',
      cost: 80000,
      riskReduction: 8,
      category: 'Human Layer',
      description: 'Interactive employee simulation and credential harvesting awareness.'
    }
  ];

  // Exact 0/1 Knapsack Dynamic Programming algorithm running in real time
  const optimizationResult = useMemo(() => {
    const unit = 10000; // Discretize to 10k units for exact table computation
    const scaledBudget = Math.floor(budget / unit);
    const n = candidateControls.length;

    const scaledCosts = candidateControls.map((c) => Math.ceil(c.cost / unit));
    const values = candidateControls.map((c) => c.riskReduction);

    // Initialize 2D DP Table
    const dp = Array.from({ length: n + 1 }, () => Array(scaledBudget + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      const cost = scaledCosts[i - 1];
      const val = values[i - 1];
      for (let w = 0; w <= scaledBudget; w++) {
        if (cost <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - cost] + val);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Backtrack to find exact selected items
    const selected = [];
    const excluded = [];
    let w = scaledBudget;
    for (let i = n; i >= 1; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push(candidateControls[i - 1]);
        w -= scaledCosts[i - 1];
      } else {
        excluded.push(candidateControls[i - 1]);
      }
    }

    selected.reverse();
    const totalCost = selected.reduce((sum, item) => sum + item.cost, 0);
    const totalReduction = selected.reduce((sum, item) => sum + item.riskReduction, 0);

    return {
      selected,
      excluded,
      totalCost,
      totalReduction,
      remainingBudget: budget - totalCost
    };
  }, [budget]);

  const presetBudgets = [
    { label: '₹3 Lakhs', value: 300000 },
    { label: '₹5 Lakhs', value: 500000 },
    { label: '₹10 Lakhs (Target)', value: 1000000 },
    { label: '₹15 Lakhs', value: 1500000 },
  ];

  return (
    <section id="optimizer" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>MATHEMATICAL ALLOCATION ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            0/1 KNAPSACK BUDGET OPTIMIZER
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Dynamic Programming algorithm maximizing modeled cybersecurity value strictly within budget constraints
          </p>
        </div>

        {/* MATH FORMULATION & RECURRENCE BANNER */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] mb-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                MATHEMATICAL GUARANTEE
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                Discrete 0/1 Optimization Problem
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Each defense control has an acquisition cost (<span className="text-cyan-300 font-mono">c_i</span>) and a modeled risk reduction value (<span className="text-cyan-300 font-mono">v_i</span>). The engine selects a subset <span className="text-cyan-300 font-mono">S</span> that maximizes total reduction while guaranteeing <span className="text-emerald-400 font-mono">∑ c_i ≤ Budget (W)</span>.
              </p>
            </div>

            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-[#080D18] border border-cyan-500/30 font-mono text-xs text-slate-200 space-y-2">
              <div className="text-cyan-400 font-bold">DP Recurrence Formulation:</div>
              <div className="text-xs sm:text-sm text-cyan-200 bg-cyan-950/40 p-2.5 rounded border border-cyan-500/20 overflow-x-auto">
                dp[i][w] = max(dp[i-1][w], dp[i-1][w - c_i] + v_i)
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Computational Complexity: O(N &times; W)</span>
                <span className="text-emerald-400">Strict Non-Fractional x_i ∈ &#123;0, 1&#125;</span>
              </div>
            </div>

          </div>
        </div>

        {/* INTERACTIVE BUDGET CONTROLLER */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] mb-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase">AVAILABLE SECURITY BUDGET (W)</span>
              <div className="text-3xl font-black font-mono text-cyan-300 mt-1">
                ₹{budget.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {presetBudgets.map((pb) => (
                <button
                  key={pb.value}
                  onClick={() => setBudget(pb.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    budget === pb.value
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                      : 'bg-[#16213A] text-slate-300 border border-[#1F2E4D] hover:border-cyan-400'
                  }`}
                >
                  {pb.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>₹1,00,000 (Min)</span>
              <span>₹10,00,000 (Recommended Baseline)</span>
              <span>₹20,00,000 (Max)</span>
            </div>
          </div>

          {/* Real-Time Solver Output Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1F2E4D]">
            <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Allocated</span>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                ₹{optimizationResult.totalCost.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Remaining Buffer</span>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                ₹{optimizationResult.remainingBudget.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Modeled Reduction</span>
              <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                +{optimizationResult.totalReduction}% Value
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Package Selection</span>
              <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
                {optimizationResult.selected.length} / {candidateControls.length} Controls
              </div>
            </div>
          </div>
        </div>

        {/* CANDIDATE CONTROLS SELECTION MATRIX */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Configured Candidate Defense Controls ({candidateControls.length})
            </h4>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              Live Dynamic Programming Partition
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidateControls.map((ctrl) => {
              const isSelected = optimizationResult.selected.some((s) => s.id === ctrl.id);
              return (
                <div
                  key={ctrl.id}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#16213A] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-[#0F172A]/80 border-[#1F2E4D] opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ctrl.category}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SELECTED IN PORTFOLIO</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-xs font-mono text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/40">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>EXCLUDED (BUDGET)</span>
                        </span>
                      )}
                    </div>

                    <h5 className="text-sm font-bold text-white font-mono">
                      {ctrl.name}
                    </h5>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {ctrl.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1F2E4D] flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-slate-500">Cost: </span>
                      <strong className="text-white">₹{ctrl.cost.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Modeled Reduction: </span>
                      <strong className={isSelected ? 'text-emerald-400' : 'text-slate-400'}>
                        +{ctrl.riskReduction}%
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainability Callout Note */}
        <div className="mt-8 p-4 rounded-xl bg-[#080D18] border border-[#1F2E4D] flex items-start space-x-3 text-xs font-mono text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-slate-200">Algorithmic Guarantee:</strong> Optimal among configured candidate investments under specified constraints. Does not rely on greedy value-to-cost heuristic shortcuts. Backtracking recovers the exact mathematical optimum.
          </div>
        </div>

      </div>
    </section>
  );
}
