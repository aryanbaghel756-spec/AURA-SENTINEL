import React, { useState } from 'react';
import { 
  Activity, 
  Globe, 
  Coins, 
  Sliders, 
  Cpu, 
  Link2, 
  Mic, 
  Eye, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export default function CoreModules({ onLaunchModule }) {
  const [selectedModule, setSelectedModule] = useState(null);

  const modules = [
    {
      id: 'system-monitoring',
      num: '01',
      title: 'SYSTEM MONITORING',
      category: 'INFRASTRUCTURE TELEMETRY',
      icon: Activity,
      tech: 'Python + FastAPI + psutil + OS APIs',
      points: [
        'Real-time CPU utilization & per-core load tracking',
        'Physical & virtual memory saturation analytics',
        'Disk I/O throughput & storage threshold monitors',
        'Active OS process table inspection & parent tracking'
      ],
      tag: 'psutil v6.0',
      status: 'OPERATIONAL'
    },
    {
      id: 'attack-surface',
      num: '02',
      title: 'ATTACK SURFACE & THREAT INTEL',
      category: 'EXTERNAL & INTERNAL PERIMETER',
      icon: Globe,
      tech: 'Python + Network/OS APIs + MITRE ATT&CK Mappings',
      points: [
        'Dynamic listening port scanner (e.g. 22, 80, 443, 3389, 8080)',
        'Network exposure & interface binding classification',
        'Automated mapping to MITRE ATT&CK techniques (T1046, T1059)',
        'Real-time anomalous connection alert triggers'
      ],
      tag: 'MITRE ATT&CK Enterprise',
      status: 'OPERATIONAL'
    },
    {
      id: 'financial-risk',
      num: '03',
      title: 'FINANCIAL RISK ENGINE',
      category: 'LOSS QUANTIFICATION',
      icon: Coins,
      tech: 'Actuarial Loss Formulas + Statistical Impact Modeling',
      highlightBadge: 'Illustrative Prototype Output',
      points: [
        'Technical Cyber Risk → Potential Financial Exposure',
        'Estimated Exposure: ₹8L – ₹15L (Illustrative Prototype Output)',
        'Confidence Interval calculation based on signal density',
        'Translates technical CVSS scores into monetary liability'
      ],
      tag: 'Loss Modeling',
      status: 'OPERATIONAL',
      notice: 'Never presented as a measured real-world field result.'
    },
    {
      id: 'what-if-engine',
      num: '04',
      title: 'WHAT-IF ENGINE',
      category: 'WARGAME SIMULATION',
      icon: Sliders,
      tech: 'Dynamic Sensitivity Analyzer + Scenario Modeler',
      highlightBadge: 'Scenario Simulation',
      points: [
        'Interactive scenario controls: CPU, Memory, Disk, Ports & Threat Conditions',
        'Outputs: Risk Score, Financial Exposure, Scenario Change',
        'Simulates denial-of-service, port exfiltration & multi-vector spikes',
        'Instant delta reporting vs real-time operational baseline'
      ],
      tag: 'Scenario Simulation',
      status: 'OPERATIONAL'
    },
    {
      id: 'investment-optimizer',
      num: '05',
      title: 'INVESTMENT OPTIMIZER',
      category: 'BUDGET-CONSTRAINED OPTIMIZATION',
      icon: Cpu,
      tech: '0/1 Knapsack Dynamic Programming Algorithm',
      highlightBadge: 'Optimal Among Configured Controls',
      points: [
        'Security Budget → Candidate Security Controls → 0/1 Knapsack DP → Selected Package',
        'Optimal among configured candidate investments under specified constraints',
        'Discrete 0/1 selection guarantee: x_i in {0, 1} with zero fractional controls',
        'Strict constraint guarantee: Sum of costs <= Budget strictly in real INR'
      ],
      tag: '0/1 Knapsack DP',
      status: 'OPERATIONAL',
      notice: 'Does not claim enterprise-wide guaranteed global optimality.'
    },
    {
      id: 'blockchain-ledger',
      num: '06',
      title: 'BLOCKCHAIN AUDIT LEDGER',
      category: 'FORENSIC INTEGRITY',
      icon: Link2,
      tech: 'SHA-256 + Merkle Tree + Hash Chaining',
      highlightBadge: 'Tamper-Evident Audit Ledger',
      points: [
        'SHA-256 → Hash Chain → Merkle Root → Integrity Verification → Tamper Detection',
        'Tamper-Evident Audit Ledger ensuring forensic non-repudiation',
        'Automatic audit block mining upon defense adjustments & alerts',
        'Interactive tamper demonstration exposes cryptographic chain breaks'
      ],
      tag: 'SHA-256 Merkle Chain',
      status: 'OPERATIONAL',
      notice: 'Tamper-evident single-node cryptographic ledger. Not decentralized consensus.'
    },
    {
      id: 'aura-voice',
      num: '07',
      title: 'AI / AURA VOICE ASSISTANT',
      category: 'NATURAL LANGUAGE OPERATOR CO-PILOT',
      icon: Mic,
      tech: 'Groq Cloud SDK + Llama-3 / Mixtral LLM APIs',
      points: [
        'Voice Input → AI Processing → Security/Risk Response',
        'Real-time natural language query of system vulnerabilities',
        'Context-aware explanation of financial risk drivers & MITRE tactics',
        'Sub-second operator command execution and guided navigation'
      ],
      tag: 'Groq LPU Engine',
      status: 'OPERATIONAL'
    },
    {
      id: 'vision-intelligence',
      num: '08',
      title: 'COMPUTER VISION + GESTURE',
      category: 'OPERATOR AUTH & WORKSTATION SAFETY',
      icon: Eye,
      tech: 'YOLOv8 + MediaPipe Hands + face-api.js',
      points: [
        'YOLOv8 → Real-time multi-class object & perimeter detection',
        'MediaPipe → Touchless gesture navigation & emergency lock',
        'Zero-trust operator presence lock when monitor is abandoned',
        'Client-side inference preserving operational sovereignty'
      ],
      tag: 'YOLOv8 + MediaPipe',
      status: 'OPERATIONAL'
    }
  ];

  return (
    <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>ACTUALLY IMPLEMENTED ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AURA SENTINEL — CORE INTELLIGENCE MODULES
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eight interconnected technical modules built, tested, and operational in the AURA Sentinel platform
          </p>
        </div>

        {/* 8 Core Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="group relative p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1"
              >
                {/* Top Bar with Number & Status */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">
                      {mod.num}
                    </span>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{mod.status}</span>
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="w-12 h-12 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/40 transition-all mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-mono text-cyan-400/90 uppercase font-bold tracking-wider block mb-1">
                    {mod.category}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono tracking-tight mb-3">
                    {mod.title}
                  </h3>

                  {/* Highlight Badge if applicable */}
                  {mod.highlightBadge && (
                    <div className="mb-3">
                      <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {mod.highlightBadge}
                      </span>
                    </div>
                  )}

                  {/* Bullet points */}
                  <ul className="space-y-2 mb-4 text-xs text-slate-300">
                    {mod.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Tech Stack & Action */}
                <div className="pt-4 border-t border-[#1F2E4D]/80 space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span className="truncate pr-2">Tech: {mod.tech}</span>
                  </div>

                  {mod.notice && (
                    <p className="text-[10px] font-mono text-slate-500 italic">
                      *{mod.notice}
                    </p>
                  )}

                  <button
                    onClick={() => onLaunchModule && onLaunchModule(mod.id)}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-mono font-semibold text-slate-300 bg-[#16213A] border border-[#1F2E4D] hover:text-white hover:border-cyan-400 hover:bg-[#1E2D4F] transition-all cursor-pointer"
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
