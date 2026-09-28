import React from 'react';
import { 
  AlertTriangle, 
  Layers, 
  Coins, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  TrendingUp,
  FileQuestion
} from 'lucide-react';

export default function Problem() {
  const problems = [
    {
      num: '01',
      title: 'FRAGMENTED SIGNALS',
      summary: 'Security telemetry is distributed across systems and tools.',
      description:
        'Modern enterprises deploy dozens of disconnected security tools—endpoint monitors, firewall logs, open port monitors, and OS metrics—creating fragmented visibility and alert fatigue without a single unified source of truth.',
      icon: Layers,
      highlight: 'Siloed Tools & No Unified Fusion'
    },
    {
      num: '02',
      title: 'TECHNICAL RISK ≠ FINANCIAL CONTEXT',
      summary: 'Security alerts alone do not clearly communicate potential business exposure.',
      description:
        'C-suite executives and CFOs think in monetary liability and operational loss, while security consoles report raw CVSS scores (7.8, 9.2). Without financial translation, boards cannot prioritize actual business risk.',
      icon: Coins,
      highlight: 'Zero Translation to Monetary Impact'
    },
    {
      num: '03',
      title: 'LIMITED SECURITY BUDGET',
      summary: 'Organizations need to decide which security investments provide the greatest modeled risk reduction within a budget.',
      description:
        'Cyber budgets are strictly finite. CISOs struggle to choose which defensive controls (EDR, SIEM, MFA, DLP) maximize risk reduction without exceeding financial limits, frequently falling back on arbitrary heuristics.',
      icon: TrendingUp,
      highlight: 'Budget Allocation Lacks Algorithmic Proof'
    }
  ];

  const pipelineStages = [
    { label: 'ALERTS', color: 'from-rose-500/20 to-rose-500/10 text-rose-300 border-rose-500/30' },
    { label: 'RISK', color: 'from-amber-500/20 to-amber-500/10 text-amber-300 border-amber-500/30' },
    { label: 'FINANCIAL CONTEXT', color: 'from-sky-500/20 to-sky-500/10 text-sky-300 border-sky-500/30' },
    { label: 'WHAT-IF', color: 'from-cyan-500/20 to-cyan-500/10 text-cyan-300 border-cyan-500/30' },
    { label: 'INVESTMENT DECISION', color: 'from-emerald-500/20 to-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  ];

  return (
    <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-rose-400 bg-rose-500/10 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>THE ENTERPRISE CHALLENGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            THE PROBLEM
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Why traditional enterprise cybersecurity operations fail to protect the bottom line
          </p>
        </div>

        {/* 3 Visually Strong Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((prob) => {
            const IconComponent = prob.icon;
            return (
              <div
                key={prob.num}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
              >
                {/* Subtle top indicator */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold font-mono text-slate-600 group-hover:text-cyan-400/80 transition-colors">
                    {prob.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-bold text-white tracking-wide font-mono">
                    {prob.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400 font-semibold">
                    {prob.summary}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed pt-1">
                    {prob.description}
                  </p>
                </div>

                {/* Bottom Highlight Chip */}
                <div className="pt-4 border-t border-[#1F2E4D]/80">
                  <span className="inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    &bull; {prob.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRANSFORMATION FLOW BANNER */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#16213A] to-[#0F172A] border border-[#1F2E4D] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="text-left max-w-sm">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-widest">
                AURA TRANSFORMATION PARADIGM
              </span>
              <h4 className="text-xl font-bold text-white mt-1">
                From Reactive Alarms to Mathematical Decisions
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                A continuous, automated decision pipeline linking real-time host telemetry to executive allocation.
              </p>
            </div>

            {/* Sequence Ribbon */}
            <div className="w-full lg:w-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {pipelineStages.map((stage, idx) => (
                <React.Fragment key={stage.label}>
                  <div className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${stage.color} border text-xs font-mono font-bold tracking-wide shadow-sm flex items-center space-x-1.5`}>
                    <span>{stage.label}</span>
                  </div>
                  {idx < pipelineStages.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-cyan-400/80 shrink-0 hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
