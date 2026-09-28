import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Coins, 
  Activity, 
  Sliders, 
  Cpu, 
  Link2, 
  Terminal, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function DashboardPreview({ onLaunchFullConsole }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'risk', label: 'Risk Intelligence', icon: ShieldAlert },
    { id: 'finance', label: 'Financial Risk', icon: Coins },
    { id: 'whatif', label: 'What-If Engine', icon: Sliders },
    { id: 'optimizer', label: 'Investment Optimizer', icon: Cpu },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: Link2 },
    { id: 'system', label: 'System Monitor', icon: Server }
  ];

  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080D18] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Activity className="w-3.5 h-3.5" />
            <span>INTERACTIVE BLUEPRINT &amp; SIMULATION CONSOLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            INTERACTIVE AURA 3D BLUEPRINT &amp; DASHBOARD PROTOTYPE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Explore the unified cyber risk intelligence dashboard architecture with realistic telemetry data (SIH Screening Simulation)
          </p>
        </div>

        {/* MOCKUP CONSOLE FRAME */}
        <div className="rounded-2xl bg-[#0B1220] border-2 border-[#1F2E4D] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Top Window Bar */}
          <div className="bg-[#0F172A] border-b border-[#1F2E4D] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            
            {/* Status & Traffic Lights */}
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              <div className="h-4 w-px bg-slate-700" />

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="font-extrabold text-white tracking-wider">AURA SENTINEL</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STATUS: ONLINE</span>
                </span>
              </div>
            </div>

            {/* Prototype Badge & Launch CTA */}
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                *3D BLUEPRINT &amp; SIMULATION PROTOTYPE
              </span>

              <button
                onClick={onLaunchFullConsole}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                <span>OPEN FULL CONSOLE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* KPI METRIC STRIP (Sample Metrics with Disclaimer) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F2E4D] border-b border-[#1F2E4D]">
            
            {/* KPI 1: Risk Score */}
            <div className="bg-[#0B1220] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>RISK SCORE</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="my-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-rose-400">82</span>
                <span className="text-slate-400 text-xs font-mono"> / 100</span>
              </div>
              <div className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 inline-block w-fit">
                High Technical Severity
              </div>
            </div>

            {/* KPI 2: Financial Exposure */}
            <div className="bg-[#0B1220] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>ESTIMATED EXPOSURE</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">₹8L – ₹15L</span>
              </div>
              <div className="text-[10px] font-mono text-amber-400/90">
                Model-Based Estimate
              </div>
            </div>

            {/* KPI 3: Confidence Rating */}
            <div className="bg-[#0B1220] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>MODEL CONFIDENCE</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">MEDIUM</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Based on 14 telemetry streams
              </div>
            </div>

            {/* KPI 4: Blockchain Audit Status */}
            <div className="bg-[#0B1220] p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>BLOCKCHAIN AUDIT</span>
                <Link2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">VERIFIED</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400/90">
                SHA-256 Block #48 Sealed
              </div>
            </div>

          </div>

          {/* Interactive Navigation Tabs */}
          <div className="bg-[#0F172A] border-b border-[#1F2E4D] px-4 flex overflow-x-auto space-x-1 py-1.5 scrollbar-thin">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#16213A]'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT PANELS */}
          <div className="p-6 bg-[#080D18] min-h-[380px]">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
                
                {/* Column 1: Threat Signals & Attack Surface */}
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-2">
                    <span className="font-bold text-white uppercase">ATTACK SURFACE SIGNALS</span>
                    <span className="text-cyan-400 text-[11px]">4 OPEN PORTS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-[#16213A] border border-rose-500/30 flex items-center justify-between">
                      <span className="text-rose-300 font-bold">Port 3389 (RDP)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">CRITICAL</span>
                    </div>
                    <div className="p-2 rounded bg-[#16213A] border border-amber-500/30 flex items-center justify-between">
                      <span className="text-amber-300 font-bold">Port 22 (SSH)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">MONITORED</span>
                    </div>
                    <div className="p-2 rounded bg-[#16213A] border border-[#1F2E4D] flex items-center justify-between">
                      <span className="text-slate-300">Port 443 (HTTPS)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">STANDARD</span>
                    </div>
                    <div className="p-2 rounded bg-[#16213A] border border-[#1F2E4D] flex items-center justify-between">
                      <span className="text-slate-300">Port 8000 (API Server)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">INTERNAL</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Top Risk Drivers */}
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-2">
                    <span className="font-bold text-white uppercase">TOP RISK DRIVERS</span>
                    <span className="text-amber-400 text-[11px]">MITRE MAPPED</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Remote Service Ingress (T1021)</span>
                        <span className="text-rose-400 font-bold">88%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-[88%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Process Discovery (T1057)</span>
                        <span className="text-amber-400 font-bold">64%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[64%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Memory Load Anomaly</span>
                        <span className="text-cyan-400 font-bold">42%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 w-[42%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Security Investment Recommendation */}
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-2">
                    <span className="font-bold text-white uppercase">OPTIMIZER ALLOCATION</span>
                    <span className="text-emerald-400 text-[11px]">BUDGET ₹10L</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-slate-300 text-[11px]">
                      Selected by 0/1 Knapsack Engine:
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>1. EDR &amp; Behavioral Guard</span>
                        <span>₹3,50,000</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>2. SIH Automated Vault / IAM</span>
                        <span>₹2,00,000</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>3. Immutable BCDR Backup</span>
                        <span>₹3,00,000</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-1">
                      <span>Total Allocated:</span>
                      <strong className="text-white">₹8,50,000</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Remaining Buffer:</span>
                      <strong className="text-emerald-400">₹1,50,000</strong>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. RISK INTELLIGENCE TAB */}
            {activeTab === 'risk' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">CONTINUOUS TECHNICAL RISK QUANTIFICATION</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">Automated signal correlation across active listening sockets &amp; OS telemetry</p>
                  </div>
                  <span className="text-amber-400 font-bold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 h-fit">
                    SEVERITY: ELEVATED (82/100)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-2">
                    <span className="text-slate-400 font-bold uppercase">Mapped MITRE Techniques</span>
                    <p className="text-slate-300">T1046 (Network Service Scanning) &bull; T1021.001 (Remote Desktop Protocol) &bull; T1059 (Command &amp; Scripting Interpreter)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-2">
                    <span className="text-slate-400 font-bold uppercase">Signal Density Vector</span>
                    <p className="text-slate-300">4 External Listening Ports &bull; 1 Anomalous Process Pattern &bull; Peak Memory Utilization: 78.4%</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FINANCIAL RISK TAB */}
            {activeTab === 'finance' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-sm">ACTUARIAL FINANCIAL LOSS PROJECTION</span>
                    <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      ILLUSTRATIVE PROTOTYPE OUTPUT
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">Translating cyber risk score (82) into potential operational downtime, incident response, and regulatory liability.</p>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
                      <div className="text-slate-400 text-[10px]">LOWER BOUND</div>
                      <div className="text-lg font-bold text-slate-200 mt-1">₹8,00,000</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <div className="text-amber-400 text-[10px]">MEDIAN EXPOSURE</div>
                      <div className="text-xl font-bold text-amber-300 mt-1">₹11,50,000</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
                      <div className="text-slate-400 text-[10px]">UPPER BOUND</div>
                      <div className="text-lg font-bold text-slate-200 mt-1">₹15,00,000</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WHAT-IF ENGINE TAB */}
            {activeTab === 'whatif' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">WARGAME THREAT SIMULATION</span>
                    <span className="text-cyan-400">DYNAMIC MODEL</span>
                  </div>
                  <p className="text-slate-400 text-xs">Simulate hypothetical attacks, credential dumps, or resource exhaustion to observe risk exposure shift in real time.</p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
                      <div className="text-slate-400 text-[11px]">CURRENT BASELINE</div>
                      <div className="text-base font-bold text-white mt-1">Risk: 82 &bull; Exposure: ₹8L–₹15L</div>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <div className="text-rose-400 text-[11px]">SIMULATED DDoS + EXFILTRATION</div>
                      <div className="text-base font-bold text-rose-300 mt-1">Risk: 94 &bull; Exposure: ₹18L–₹25L</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. INVESTMENT OPTIMIZER TAB */}
            {activeTab === 'optimizer' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">0/1 KNAPSACK DYNAMIC PROGRAMMING ENGINE</span>
                    <span className="text-emerald-400 font-bold">O(N·W) OPTIMALITY</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Guarantees the maximum possible security risk reduction without exceeding the discrete budget limit.
                  </p>
                  <div className="p-3 rounded-lg bg-[#16213A] border border-cyan-500/30 text-cyan-200">
                    Formula: dp[i][w] = max(dp[i-1][w], dp[i-1][w - cost_i] + value_i)
                  </div>
                </div>
              </div>
            )}

            {/* 6. BLOCKCHAIN LEDGER TAB */}
            {activeTab === 'blockchain' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">TAMPER-EVIDENT CRYPTOGRAPHIC LEDGER</span>
                    <span className="text-emerald-400 font-bold">ALL HASHES MATCH</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D] space-y-1.5">
                    <div className="text-slate-400 text-[10px]">LATEST BLOCK #48:</div>
                    <div className="text-cyan-300 break-all font-mono">0000a39f1c7e92b8d4f056a2e8813bc58d1976f0c4327ab31e847c1a8e19d5b7</div>
                    <div className="text-slate-400 text-[10px] pt-1">PREVIOUS BLOCK HASH:</div>
                    <div className="text-slate-400 break-all font-mono">0000f72a81b3ce99120de840938f71295b9c40217ea96b01538fcda45279b921</div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SYSTEM MONITOR TAB */}
            {activeTab === 'system' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">REAL-TIME HOST TELEMETRY (psutil)</span>
                    <span className="text-cyan-400 font-bold">POLLING 1000ms</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
                      <div className="text-slate-400 text-[10px]">CPU USAGE</div>
                      <div className="text-lg font-bold text-white mt-1">24.6%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
                      <div className="text-slate-400 text-[10px]">MEMORY (RAM)</div>
                      <div className="text-lg font-bold text-cyan-300 mt-1">62.8%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#16213A] border border-[#1F2E4D]">
                      <div className="text-slate-400 text-[10px]">DISK I/O</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">14.2 MB/s</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Bar: Action prompt to launch the live platform */}
          <div className="bg-[#0F172A] border-t border-[#1F2E4D] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-slate-400">
              *All figures shown in mockup are illustrative model outputs for demonstration purposes.
            </span>
            <button
              onClick={onLaunchFullConsole}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <span>Launch Live Working Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
