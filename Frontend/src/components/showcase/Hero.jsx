import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Play, 
  Zap, 
  Cpu, 
  Activity, 
  TrendingDown, 
  Lock, 
  CheckCircle2, 
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Hero({ onExploreAura, onLaunchPrototype, onOpenJudgeMode }) {
  const [pulseIndex, setPulseIndex] = useState(0);

  // Rotate through telemetry signal pulses
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#080D18] via-[#0B1220] to-[#080D18]">
      
      {/* Background Cyber Tech Grid & Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F2E4D15_1px,transparent_1px),linear-gradient(to_bottom,#1F2E4D15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT / CENTER CONTENT */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          
          {/* Hackathon Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SIH 2026</span>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-900/80 border border-slate-700/60">
              PS: <strong className="text-white ml-1">SIH26105</strong>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-900/80 border border-slate-700/60">
              Team: <strong className="text-cyan-300 ml-1">ByteForce_1</strong>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30">
              Theme: Blockchain & Cyber
            </span>
          </div>

          {/* Large Title & Brand */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                A.U.R.A.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]">
                SENTINEL
              </span>
            </h1>

            <p className="text-base sm:text-lg font-mono font-semibold tracking-wide text-cyan-300/90 pt-1">
              Autonomous Unified Risk Analytics Platform
            </p>

            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              AI-Powered Continuous Cyber Risk Quantification &amp; Investment Optimization Platform
            </p>
          </div>

          {/* Value Proposition Statement */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#16213A]/60 border border-[#1F2E4D] backdrop-blur-md relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600" />
            <p className="text-base sm:text-lg text-slate-200 font-medium italic leading-relaxed">
              &ldquo;From fragmented security signals to financially informed, budget-aware cyber decisions.&rdquo;
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreAura}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>EXPLORE AURA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchPrototype}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-[#16213A] border border-[#1F2E4D] hover:border-cyan-400 hover:text-white hover:bg-[#1E2D4F] transition-all duration-300 shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>VIEW LIVE PROTOTYPE</span>
            </button>

            <button
              onClick={onOpenJudgeMode}
              className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 hover:border-amber-400 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>JUDGE MODE (60s SPEED-RUN)</span>
            </button>
          </div>

          {/* Quick Pillar Bullets */}
          <div className="grid grid-cols-3 gap-3 pt-4 w-full border-t border-[#1F2E4D]/80">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Pipeline</div>
              <div className="text-xs font-semibold text-white mt-0.5">Continuous Telemetry</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Optimization</div>
              <div className="text-xs font-semibold text-cyan-400 mt-0.5">0/1 Knapsack DP</div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Accountability</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">Tamper-Evident SHA-256</div>
            </div>
          </div>

        </div>

        {/* RIGHT: FUTURISTIC AURA SENTINEL VISUALIZATION */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* Main Visual Card Container */}
          <div className="relative w-full max-w-md lg:max-w-none p-6 rounded-2xl bg-[#0F172A]/80 border border-[#1F2E4D] shadow-[0_0_50px_rgba(15,23,42,0.8)] backdrop-blur-xl">
            
            {/* Ambient Corner Accents */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

            {/* Top Engine Status Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2E4D] text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-semibold">AURA ENGINE : ACTIVE</span>
              </div>
              <span className="text-[11px] text-cyan-400">LATENCY 4.2ms</span>
            </div>

            {/* Central Orbital Node Visualization */}
            <div className="relative my-8 flex items-center justify-center min-h-[280px]">
              
              {/* Outer Orbit Ring */}
              <div className="absolute w-64 h-64 rounded-full border border-dashed border-cyan-500/20 animate-[spin_30s_linear_infinite]" />
              {/* Middle Orbit Ring */}
              <div className="absolute w-48 h-48 rounded-full border border-cyan-500/30 animate-[spin_20s_linear_infinite_reverse]" />
              
              {/* Core Shield Node */}
              <div className="relative z-20 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#16213A] to-[#0B1220] border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(34,211,238,0.4)] flex flex-col items-center justify-center">
                <Shield className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span className="text-[9px] font-mono uppercase text-cyan-300 font-bold tracking-wider mt-1">
                  AI CORE
                </span>
              </div>

              {/* Orbiting Satellite Node 1: Cyber Telemetry Streams */}
              <div className={`absolute top-0 transform -translate-y-2 px-3 py-1.5 rounded-lg bg-[#16213A] border ${pulseIndex === 0 ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-[#1F2E4D]'} transition-all duration-500 flex items-center space-x-2 text-[11px] font-mono`}>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-200">Telemetry Stream</span>
              </div>

              {/* Orbiting Satellite Node 2: Financial Exposure */}
              <div className={`absolute bottom-0 transform translate-y-2 px-3 py-1.5 rounded-lg bg-[#16213A] border ${pulseIndex === 1 ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'border-[#1F2E4D]'} transition-all duration-500 flex items-center space-x-2 text-[11px] font-mono`}>
                <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <span className="text-slate-200">Est. Exposure: </span>
                  <strong className="text-amber-300">₹8L–₹15L</strong>
                </div>
              </div>

              {/* Orbiting Satellite Node 3: 0/1 Knapsack Optimizer */}
              <div className={`absolute right-0 transform translate-x-4 px-3 py-1.5 rounded-lg bg-[#16213A] border ${pulseIndex === 2 ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'border-[#1F2E4D]'} transition-all duration-500 flex items-center space-x-2 text-[11px] font-mono`}>
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-slate-200">0/1 Knapsack DP</span>
              </div>

              {/* Orbiting Satellite Node 4: Merkle Audit Chain */}
              <div className={`absolute left-0 transform -translate-x-4 px-3 py-1.5 rounded-lg bg-[#16213A] border ${pulseIndex === 3 ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'border-[#1F2E4D]'} transition-all duration-500 flex items-center space-x-2 text-[11px] font-mono`}>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-200">SHA-256 Ledger</span>
              </div>

            </div>

            {/* Bottom Engine Decision Output Banner */}
            <div className="pt-3 border-t border-[#1F2E4D] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Current Synthesized Decision:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-[11px]">
                  DEFENSE OPTIMAL
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#1F2E4D] text-xs font-mono text-slate-300 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>
                  Budget: ₹10,00,000 &bull; 4 Controls Selected &bull; Total Residual Risk Reduced
                </span>
              </div>
              <div className="text-[10px] text-right font-mono text-slate-500">
                *Illustrative Prototype Output
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Down Chevron Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={onExploreAura}>
        <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1">DISCOVER PIPELINE</span>
        <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
      </div>

    </section>
  );
}
