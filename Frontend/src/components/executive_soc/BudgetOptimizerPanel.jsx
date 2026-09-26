import React, { useState, useMemo } from 'react';
import { 
  Calculator, CheckCircle2, XCircle, TrendingUp, DollarSign, Layers, Sparkles, AlertCircle 
} from 'lucide-react';
import { INITIAL_CONTROLS, runKnapsackOptimization } from './socData';

export default function BudgetOptimizerPanel() {
  const [budgetLakhs, setBudgetLakhs] = useState(150.0);
  const [customOverrides, setCustomOverrides] = useState({});
  const [useStrictAlgorithm, setUseStrictAlgorithm] = useState(true);

  // Run 0/1 Knapsack optimization
  const knapsackResult = useMemo(() => {
    return runKnapsackOptimization(budgetLakhs, INITIAL_CONTROLS);
  }, [budgetLakhs]);

  // Handle manual toggle by judges if they want to test custom portfolios
  const handleToggleControl = (id) => {
    setUseStrictAlgorithm(false);
    setCustomOverrides(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !knapsackResult.controls.find(c => c.id === id)?.funded
    }));
  };

  const handleResetToOptimal = () => {
    setCustomOverrides({});
    setUseStrictAlgorithm(true);
  };

  // If user overridden, compute metrics dynamically
  const displayData = useMemo(() => {
    if (useStrictAlgorithm || Object.keys(customOverrides).length === 0) {
      return knapsackResult;
    }

    const modifiedControls = INITIAL_CONTROLS.map(c => {
      const isFunded = customOverrides[c.id] !== undefined 
        ? customOverrides[c.id] 
        : knapsackResult.controls.find(k => k.id === c.id)?.funded;
      return {
        ...c,
        funded: isFunded,
        status: isFunded ? "FUNDED" : "DEFERRED",
        efficiency_ratio: parseFloat((c.risk_reduction_lakhs / c.cost_lakhs).toFixed(2))
      };
    });

    const allocatedCost = modifiedControls
      .filter(c => c.funded)
      .reduce((sum, c) => sum + c.cost_lakhs, 0);

    const totalReduction = modifiedControls
      .filter(c => c.funded)
      .reduce((sum, c) => sum + c.risk_reduction_lakhs, 0);

    const roi = allocatedCost > 0 ? parseFloat((totalReduction / allocatedCost).toFixed(2)) : 0.0;

    return {
      budget_lakhs: budgetLakhs,
      allocated_cost_lakhs: parseFloat(allocatedCost.toFixed(1)),
      unallocated_budget_lakhs: parseFloat(Math.max(0, budgetLakhs - allocatedCost).toFixed(1)),
      total_risk_reduction_lakhs: parseFloat(totalReduction.toFixed(1)),
      total_risk_reduction_crores: parseFloat((totalReduction / 100.0).toFixed(2)),
      roi_multiple: roi,
      funded_count: modifiedControls.filter(c => c.funded).length,
      total_controls: modifiedControls.length,
      controls: modifiedControls
    };
  }, [knapsackResult, customOverrides, useStrictAlgorithm, budgetLakhs]);

  const isOverBudget = displayData.allocated_cost_lakhs > budgetLakhs;

  return (
    <div className="space-y-6">
      {/* HEADER & INPUT SECTION */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1F2E4D]">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Algorithmic Capital Allocation // 0/1 Knapsack (DP)</span>
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-400" />
              Cybersecurity Security Budget Optimizer
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Solves the bounded 0/1 Knapsack problem in <code className="text-emerald-400 font-mono">O(N × W)</code> dynamic 
              programming time to maximize enterprise financial risk reduction per Rupee invested.
            </p>
          </div>

          {/* BUDGET CONTROLLER */}
          <div className="bg-[#0B1220] border border-emerald-500/30 rounded-xl p-5 min-w-[320px]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Available Budget (₹ Lakhs)
              </label>
              <div className="flex items-baseline space-x-1">
                <span className="text-emerald-400 text-2xl font-extrabold">₹{budgetLakhs}</span>
                <span className="text-slate-400 text-xs font-medium">Lakh</span>
              </div>
            </div>

            <input 
              type="range"
              min="30"
              max="350"
              step="5"
              value={budgetLakhs}
              onChange={(e) => {
                setBudgetLakhs(parseFloat(e.target.value));
                setUseStrictAlgorithm(true);
                setCustomOverrides({});
              }}
              className="w-full h-2 bg-[#16213A] rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>₹30 Lakh</span>
              <span>₹150 Lakh (Baseline)</span>
              <span>₹350 Lakh</span>
            </div>

            <div className="flex gap-2 mt-3">
              {[75, 120, 150, 200, 250].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setBudgetLakhs(preset);
                    setUseStrictAlgorithm(true);
                    setCustomOverrides({});
                  }}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
                    budgetLakhs === preset 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-[#16213A] border-[#1F2E4D] text-slate-400 hover:text-white'
                  }`}
                >
                  ₹{preset}L
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Allocated Capital</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`font-bold text-xl sm:text-2xl ${isOverBudget ? 'text-rose-400' : 'text-white'}`}>
                ₹{displayData.allocated_cost_lakhs}
              </span>
              <span className="text-xs text-slate-400">Lakh / ₹{budgetLakhs}L</span>
            </div>
            <span className={`text-xs mt-1 block ${isOverBudget ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
              {isOverBudget ? 'Exceeds target budget limit!' : `Remaining buffer: ₹${displayData.unallocated_budget_lakhs}L`}
            </span>
          </div>

          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Total Risk Reduction</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-emerald-400 font-bold text-xl sm:text-2xl">
                ₹{displayData.total_risk_reduction_crores}
              </span>
              <span className="text-xs text-slate-300 font-semibold">Crores</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block">
              ₹{displayData.total_risk_reduction_lakhs} Lakhs quantified benefit
            </span>
          </div>

          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Portfolio ROI Multiple</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-cyan-400 font-bold text-xl sm:text-2xl">
                {displayData.roi_multiple}×
              </span>
              <span className="text-xs text-slate-400">benefit ratio</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block">
              Quantified ₹ benefit per ₹1 invested
            </span>
          </div>

          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Funded Controls</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-violet-400 font-bold text-xl sm:text-2xl">
                {displayData.funded_count}
              </span>
              <span className="text-xs text-slate-400">/ {displayData.total_controls} controls</span>
            </div>
            <span className="text-slate-400 text-xs mt-1 block">
              {useStrictAlgorithm ? 'Mathematically optimal solution' : 'Custom simulated manual portfolio'}
            </span>
          </div>
        </div>

        {/* CUSTOM SIMULATION STATUS & RESET */}
        {!useStrictAlgorithm && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>You are viewing a custom manual selection. Comparing against DP optimal solution.</span>
            </div>
            <button
              onClick={handleResetToOptimal}
              className="py-1 px-3 bg-amber-500/20 hover:bg-amber-500/30 rounded font-semibold text-amber-200 border border-amber-500/40"
            >
              Reset to 0/1 Knapsack Optimum
            </button>
          </div>
        )}
      </div>

      {/* SECURITY CONTROLS PORTFOLIO TABLE */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F2E4D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Security Control Investment Portfolio ({displayData.controls.length} Enterprise Controls)
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Controls ranked and evaluated by cost-benefit efficiency ratio for bounded dynamic programming knapsack.
            </p>
          </div>
          <span className="text-slate-400 text-xs bg-[#0B1220] py-1.5 px-3 rounded border border-[#1F2E4D]">
            Click any row toggle to simulate alternative manual allocations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1220]/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-[#1F2E4D]">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Control Name & Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost (₹ Lakhs)</th>
                <th className="py-3 px-4 text-right">Risk Reduction</th>
                <th className="py-3 px-4 text-right">Efficiency Ratio</th>
                <th className="py-3 px-4 text-center">Interactive Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2E4D]">
              {displayData.controls.map((ctrl) => {
                const isFunded = ctrl.funded;
                return (
                  <tr 
                    key={ctrl.id}
                    className={`transition-colors hover:bg-[#1E2D4F]/50 ${
                      isFunded ? 'bg-emerald-500/[0.04]' : 'bg-transparent opacity-85'
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isFunded ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          FUNDED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          DEFERRED
                        </span>
                      )}
                    </td>

                    {/* Name & Description */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-white text-sm">{ctrl.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5 leading-snug line-clamp-2">
                        {ctrl.description}
                      </div>
                      <div className="text-[11px] text-cyan-400/80 font-mono mt-0.5">
                        NIST SP 800-53: {ctrl.nist_mapping}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-300 bg-[#0B1220] py-1 px-2 rounded border border-[#1F2E4D]">
                        {ctrl.category}
                      </span>
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-white text-sm">
                      ₹{ctrl.cost_lakhs.toFixed(1)}L
                    </td>

                    {/* Risk Reduction */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      ₹{ctrl.risk_reduction_lakhs.toFixed(1)}L
                    </td>

                    {/* Efficiency Ratio */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-cyan-300">
                      {ctrl.efficiency_ratio}×
                    </td>

                    {/* Action Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleControl(ctrl.id)}
                        className={`text-xs py-1 px-2.5 rounded font-medium border transition-all ${
                          isFunded 
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20' 
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        {isFunded ? 'Defund' : 'Fund'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
