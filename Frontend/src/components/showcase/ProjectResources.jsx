import React from 'react';
import { 
  GitBranch, 
  ExternalLink, 
  Play, 
  Compass, 
  Shield, 
  Code2, 
  CheckCircle2,
  Terminal,
  FolderGit2
} from 'lucide-react';

export default function ProjectResources({ onExploreAura, onLaunchPrototype }) {
  const githubRepoUrl = 'https://github.com/aryanbaghel756-spec/AURA-SENTINEL';

  return (
    <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080D18] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>SUBMISSION ARTIFACTS &amp; DEMOS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            PROJECT RESOURCES
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Direct access to the source code repository, architectural blueprints, and interactive live prototype
          </p>
        </div>

        {/* 3 Large Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 01: GITHUB REPOSITORY */}
          <div className="p-8 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(34,211,238,0.15)] group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                  01
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                  <GitBranch className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  OPEN SOURCE CODEBASE
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  GITHUB REPOSITORY
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  Explore the complete AURA Sentinel source code including the 0/1 Knapsack DP optimizer, FastAPI backend, test suites, and React client.
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-400 pb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Comprehensive Unit Test Suite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Mathematical Proofs &amp; README</span>
                </div>
              </div>
            </div>

            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-[#16213A] border border-[#1F2E4D] hover:bg-slate-800 hover:border-cyan-400 transition-all cursor-pointer"
            >
              <span>VIEW GITHUB REPOSITORY</span>
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>
          </div>

          {/* CARD 02: AURA WEBSITE / UI-UX */}
          <div className="p-8 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(34,211,238,0.15)] group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-slate-600 group-hover:text-cyan-400 transition-colors">
                  02
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                  <Compass className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  DESIGN SYSTEM &amp; BLUEPRINTS
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  AURA WEBSITE / UI-UX
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  Explore the product interface, component hierarchy, cyber SOC ergonomics, and continuous telemetry pipelines built for SIH 2026.
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-400 pb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>8 Core Microservice Modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive What-If Wargame</span>
                </div>
              </div>
            </div>

            <button
              onClick={onExploreAura}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-[#16213A] border border-[#1F2E4D] hover:bg-slate-800 hover:border-cyan-400 transition-all cursor-pointer"
            >
              <span>EXPLORE AURA ARCHITECTURE</span>
              <Compass className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* CARD 03: LIVE PROTOTYPE / DEMO */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#16213A] to-[#0F172A] border-2 border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between shadow-[0_0_35px_rgba(34,211,238,0.2)] group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-cyan-400">
                  03
                </span>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
                  <Play className="w-6 h-6 fill-cyan-400 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  FULL INTERACTIVE EXPERIENCE
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  LIVE PROTOTYPE / DEMO
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  See AURA Sentinel in action. Switch into the Executive SOC console, run budget optimizations, inspect live telemetry, and trigger audit hashes.
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-300 pb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-Time Host Telemetry Stream</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live 0/1 Knapsack DP Budget Optimizer</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchPrototype}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>LAUNCH LIVE PROTOTYPE ⚡</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
