import React from 'react';
import { 
  Code2, 
  Server, 
  Activity, 
  Bot, 
  Eye, 
  Shield, 
  Database, 
  Cpu, 
  Lock,
  Layers
} from 'lucide-react';

export default function TechnologyStack() {
  const stackCategories = [
    {
      category: 'Frontend & UI Engineering',
      icon: Code2,
      techs: [
        { name: 'React 19', role: 'Reactive component framework & state management' },
        { name: 'Vite', role: 'Next-gen HMR bundler & optimized production builds' },
        { name: 'Tailwind CSS', role: 'Cyber SOC dark design system & responsive styling' },
      ]
    },
    {
      category: 'Backend Microservices',
      icon: Server,
      techs: [
        { name: 'Python 3.10', role: 'Core analytical runtime & mathematical engines' },
        { name: 'FastAPI', role: 'Asynchronous REST APIs & WebSocket telemetry streaming' },
        { name: 'Uvicorn', role: 'High-performance ASGI production web server' },
      ]
    },
    {
      category: 'System & Network Telemetry',
      icon: Activity,
      techs: [
        { name: 'psutil', role: 'Kernel-level CPU, RAM, disk, & process monitoring' },
        { name: 'OS Sockets & APIs', role: 'Active listening port & perimeter network discovery' },
      ]
    },
    {
      category: 'AI Assistant & LLM Engine',
      icon: Bot,
      techs: [
        { name: 'Groq Cloud SDK', role: 'Ultra-low latency inference engine' },
        { name: 'Llama-3 / Mixtral', role: 'Risk summarization & security Q&A co-pilot' },
      ]
    },
    {
      category: 'Computer Vision & Touchless Control',
      icon: Eye,
      techs: [
        { name: 'YOLOv8', role: 'Real-time multi-class object & presence detection' },
        { name: 'MediaPipe', role: 'Low-latency hand gesture recognition & emergency lock' },
      ]
    },
    {
      category: 'Threat Taxonomy & Mapping',
      icon: Shield,
      techs: [
        { name: 'MITRE ATT&CK', role: 'Enterprise adversary technique mapping (T1046, T1059)' },
        { name: 'CVSS v3.1 Logic', role: 'Technical severity weighting & vulnerability indexing' },
      ]
    },
    {
      category: 'Local Persistence & State',
      icon: Database,
      techs: [
        { name: 'SQLite', role: 'Relational local audit logs & session storage' },
        { name: 'JSON Ledger Store', role: 'Immutable block state persistence on disk' },
      ]
    },
    {
      category: 'Mathematical Optimization',
      icon: Cpu,
      techs: [
        { name: '0/1 Knapsack DP', role: 'Discrete dynamic programming budget allocation' },
        { name: 'State Backtracker', role: 'Exact portfolio subset recovery under cost limits' },
      ]
    },
    {
      category: 'Cryptographic Integrity',
      icon: Lock,
      techs: [
        { name: 'SHA-256 Hashing', role: 'Cryptographic data integrity & block linking' },
        { name: 'Merkle Tree', role: 'Hierarchical tamper-evident event batch validation' },
        { name: 'Proof-of-Work Nonce', role: 'Computational proof sealing block records' },
      ]
    }
  ];

  return (
    <section id="techstack" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080D18] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>PRODUCTION ENGINEERING ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            TECHNOLOGY STACK
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The specialized, battle-tested engineering stack powering the AURA Sentinel platform
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.category}
                className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                      {cat.category}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {cat.techs.map((t) => (
                      <div key={t.name} className="p-2.5 rounded-lg bg-[#16213A]/60 border border-[#1F2E4D]/80">
                        <div className="text-xs font-bold font-mono text-cyan-300">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {t.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1F2E4D]/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Production Verified</span>
                  <span className="text-emerald-400 font-bold">&bull; Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Defensive Architecture Compliance Note */}
        <div className="mt-10 p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] text-xs font-mono text-slate-400">
          <strong className="text-slate-300 uppercase">Architecture Scope Statement: </strong>
          The components listed above represent the operational system. Prospective enterprise frameworks (such as full NIST CSF 2.0 or FAIR quantitative distributions) are explicitly reserved for the project roadmap and are not claimed as baseline implementations.
        </div>

      </div>
    </section>
  );
}
