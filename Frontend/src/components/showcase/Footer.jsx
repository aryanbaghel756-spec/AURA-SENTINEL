import React from 'react';
import { 
  Shield, 
  ExternalLink, 
  ArrowUp, 
  Heart, 
  CheckCircle2, 
  Lock, 
  Coins, 
  Cpu, 
  FileText 
} from 'lucide-react';

export default function Footer({ onOpenJudgeMode, onLaunchPrototype }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050811] border-t border-[#1F2E4D] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-400 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1 & 2: Brand & Hackathon Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#080D18] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-wider font-mono">
                  A.U.R.A. SENTINEL
                </span>
                <div className="text-[10px] text-cyan-400">
                  SIH 2026 &bull; Problem Statement SIH26105
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              Autonomous Unified Risk Analytics Platform — AI-powered continuous cyber risk quantification, dynamic scenario stress-testing, and mathematically optimal 0/1 Knapsack defense allocation.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-0.5 rounded bg-[#16213A] text-slate-300 border border-[#1F2E4D] text-[10px]">
                Team: ByteForce_1 (180219)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#16213A] text-slate-300 border border-[#1F2E4D] text-[10px]">
                Category: Software – Enterprise Defense
              </span>
              <span className="px-2 py-0.5 rounded bg-[#16213A] text-cyan-300 border border-cyan-500/30 text-[10px]">
                Theme: Blockchain &amp; Cybersecurity
              </span>
            </div>
          </div>

          {/* Column 3: Platform Modules */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-xs">
              CORE MODULES
            </div>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#modules" className="hover:text-cyan-400 transition-colors">System Telemetry (psutil)</a></li>
              <li><a href="#modules" className="hover:text-cyan-400 transition-colors">Attack Surface &amp; Ports</a></li>
              <li><a href="#modules" className="hover:text-cyan-400 transition-colors">Financial Loss Engine</a></li>
              <li><a href="#whatif" className="hover:text-cyan-400 transition-colors">What-If Wargame Simulator</a></li>
              <li><a href="#optimizer" className="hover:text-cyan-400 transition-colors">0/1 Knapsack Optimizer</a></li>
              <li><a href="#blockchain" className="hover:text-cyan-400 transition-colors">SHA-256 Merkle Ledger</a></li>
            </ul>
          </div>

          {/* Column 4: Standards & Research */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-xs">
              STANDARDS &amp; RESEARCH
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                  <span>MITRE ATT&amp;CK</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://csrc.nist.gov/pubs/fips/180-4/upd1/final" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                  <span>NIST FIPS 180-4 (SHA-256)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://docs.ultralytics.com/models/yolov8/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                  <span>Ultralytics YOLOv8</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://psutil.readthedocs.io/en/stable/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                  <span>psutil Telemetry Library</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://console.groq.com/docs/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                  <span>Groq Cloud LPU SDK</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Evaluation Actions */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-xs">
              EVALUATOR TOOLS
            </div>
            <div className="space-y-2">
              <button
                onClick={onOpenJudgeMode}
                className="w-full text-left p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-bold text-xs flex items-center justify-between cursor-pointer"
              >
                <span>Judge Mode (60s)</span>
                <span className="text-[10px] font-mono">&rarr;</span>
              </button>

              <button
                onClick={onLaunchPrototype}
                className="w-full text-left p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-bold text-xs flex items-center justify-between cursor-pointer"
              >
                <span>Live Prototype Console</span>
                <span className="text-[10px] font-mono">&rarr;</span>
              </button>

              <a
                href="https://github.com/aryanbaghel756-spec/AURA-SENTINEL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block p-2.5 rounded-lg bg-[#16213A] border border-[#1F2E4D] text-slate-300 hover:text-white text-xs"
              >
                GitHub Repository ↗
              </a>
            </div>
          </div>

        </div>

        {/* COMPREHENSIVE LEGAL & ACADEMIC DISCLAIMER BANNER */}
        <div className="p-5 rounded-2xl bg-[#080D18] border border-[#1F2E4D] space-y-2 text-[11px] leading-relaxed text-slate-400 font-sans">
          <div className="text-slate-300 font-mono font-bold uppercase text-xs">
            Academic Prototype Scope &amp; Legal Disclaimers
          </div>
          <p>
            <strong>Prototype Status:</strong> AURA Sentinel is an academic research prototype engineered for the Smart India Hackathon 2026. All displayed financial loss estimates (e.g. ₹8L – ₹15L) and scenario deltas are model-based outputs generated for demonstration and architectural evaluation; they do not represent measured real-world loss claims or actuarial warranties.
          </p>
          <p>
            <strong>Algorithmic Optimality:</strong> The 0/1 Knapsack Budget Optimizer delivers provable mathematical optimality strictly among configured candidate defense controls under user-specified discrete budget constraints. It does not claim enterprise-wide guaranteed global optimality.
          </p>
          <p>
            <strong>Cryptographic Integrity:</strong> The blockchain ledger is a tamper-evident cryptographic data structure utilizing SHA-256 hashing and Merkle trees on a localized node to provide forensic auditability; it does not utilize decentralized multi-party consensus.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1F2E4D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500">
            &copy; 2026 AURA Sentinel &bull; Team ByteForce_1 &bull; Smart India Hackathon 2026
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#16213A] border border-[#1F2E4D] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
