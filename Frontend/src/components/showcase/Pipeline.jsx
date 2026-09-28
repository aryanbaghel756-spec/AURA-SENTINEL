import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  GitMerge, 
  ShieldAlert, 
  TrendingDown, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Layers,
  ArrowDown
} from 'lucide-react';

export default function Pipeline() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 0,
      title: 'SYSTEM & SECURITY TELEMETRY',
      subtitle: 'Host & Network Ingestion',
      icon: Activity,
      color: 'cyan',
      input: 'Live CPU, RAM, disk I/O, open ports, network connections & active OS processes via psutil.',
      transform: 'Asynchronous event streaming and OS-level socket monitoring at 1-second cadence.',
      output: 'Raw telemetry event stream with timestamped system state.'
    },
    {
      id: 1,
      title: 'COLLECT & NORMALIZE',
      subtitle: 'Schema Ingestion',
      icon: Database,
      color: 'sky',
      input: 'Multi-source heterogeneous logs, process tables, and raw port banners.',
      transform: 'Standardization into unified JSON schema, timestamp synchronization & validation.',
      output: 'Normalized telemetry records ready for correlation engine.'
    },
    {
      id: 2,
      title: 'SIGNAL CORRELATION',
      subtitle: 'Anomaly Detection',
      icon: GitMerge,
      color: 'blue',
      input: 'Normalized system telemetry + network interface statistics.',
      transform: 'Statistical baseline comparison, threshold deviation & multi-sensor anomaly fusion.',
      output: 'Correlated anomalous signal clusters with confidence ratings.'
    },
    {
      id: 3,
      title: 'THREAT / RISK ANALYSIS',
      subtitle: 'MITRE Mapping',
      icon: ShieldAlert,
      color: 'rose',
      input: 'Correlated anomalous activity + discovered listening ports.',
      transform: 'Heuristic alignment with MITRE ATT&CK techniques (T1046, T1059) & CVSS scoring.',
      output: 'Composite technical risk score (0-100 scale, e.g., 82/100).'
    },
    {
      id: 4,
      title: 'FINANCIAL EXPOSURE',
      subtitle: 'Loss Quantification',
      icon: TrendingDown,
      color: 'amber',
      input: 'Technical risk score, asset criticality tier & organization profile.',
      transform: 'Translates technical severity into modeled enterprise financial exposure ranges.',
      output: 'Estimated Loss Exposure: ₹8L – ₹15L (Illustrative Prototype Output).'
    },
    {
      id: 5,
      title: 'WHAT-IF SIMULATION',
      subtitle: 'Wargame Engine',
      icon: Sliders,
      color: 'violet',
      input: 'Configurable threat parameters (open ports, threat signals, server load).',
      transform: 'Dynamic sensitivity analysis recalculating residual exposure under simulated conditions.',
      output: 'Scenario risk deltas with proactive impact projections.'
    },
    {
      id: 6,
      title: 'INVESTMENT OPTIMIZATION',
      subtitle: '0/1 Knapsack DP',
      icon: Cpu,
      color: 'emerald',
      input: 'Available security budget (₹W) + configured candidate defensive controls (c_i, v_i).',
      transform: 'Exact 0/1 Knapsack dynamic programming maximizing risk reduction strictly within budget.',
      output: 'Optimal defense portfolio (selected vs excluded controls) with zero heuristic shortcuts.'
    },
    {
      id: 7,
      title: 'DECISION + AUDIT',
      subtitle: 'Tamper-Evident Ledger',
      icon: ShieldCheck,
      color: 'teal',
      input: 'Selected defense package, exposure reduction metrics & operator decision.',
      transform: 'Cryptographic SHA-256 block creation, Merkle root calculation & chained verification.',
      output: 'Immutable audit entry mined on local tamper-evident blockchain ledger.'
    }
  ];

  const current = stages[activeStage];
  const Icon = current.icon;

  return (
    <section id="pipeline" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080D18] relative border-t border-[#1F2E4D]">
      
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>OPERATIONAL ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            FROM SIGNALS TO DECISIONS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The 8-stage autonomous pipeline converting raw machine telemetry into auditable board-level cybersecurity investments
          </p>
        </div>

        {/* INTERACTIVE PIPELINE FLOW VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 8 Pipeline Stages list */}
          <div className="lg:col-span-6 space-y-2.5">
            {stages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isSelected = activeStage === idx;
              return (
                <div key={stage.id} className="relative">
                  <button
                    onClick={() => setActiveStage(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#16213A] border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.25)] translate-x-1'
                        : 'bg-[#0F172A]/70 border-[#1F2E4D] hover:border-slate-600 hover:bg-[#16213A]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected 
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/40' 
                          : 'bg-[#1E2D4F] text-slate-300'
                      }`}>
                        0{idx + 1}
                      </div>

                      <div>
                        <div className={`text-xs font-mono font-bold tracking-wider ${
                          isSelected ? 'text-cyan-300' : 'text-slate-200'
                        }`}>
                          {stage.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans">
                          {stage.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isSelected && (
                        <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase font-semibold">
                          Active
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  </button>

                  {/* Flow connector down arrow for mobile */}
                  {idx < stages.length - 1 && (
                    <div className="lg:hidden flex justify-center py-1">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Breakdown of Selected Stage */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A] border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(15,23,42,0.9)] relative backdrop-blur-xl">
              
              {/* Corner tech accents */}
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 rounded-bl-xl border-b border-l border-cyan-500/30 font-bold">
                STAGE 0{current.id + 1} / 08
              </div>

              {/* Stage Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight font-mono">
                    {current.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">
                    {current.subtitle}
                  </p>
                </div>
              </div>

              {/* Input, Transformation, Output Cards */}
              <div className="space-y-4">
                
                {/* 1. Input */}
                <div className="p-4 rounded-xl bg-[#16213A]/70 border border-[#1F2E4D]">
                  <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Inputs &amp; Signals</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {current.input}
                  </p>
                </div>

                {/* 2. Transformation Logic */}
                <div className="p-4 rounded-xl bg-[#16213A]/70 border border-[#1F2E4D]">
                  <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Engine Transformation</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {current.transform}
                  </p>
                </div>

                {/* 3. Output */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                  <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase text-cyan-400 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Output Artifact</span>
                  </div>
                  <p className="text-xs text-cyan-100 font-semibold leading-relaxed font-sans">
                    {current.output}
                  </p>
                </div>

              </div>

              {/* Informational Footer Note */}
              <div className="mt-6 pt-4 border-t border-[#1F2E4D] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-time execution across distributed microservices</span>
                </span>
                <span className="text-cyan-400 font-bold">100% Automated</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
