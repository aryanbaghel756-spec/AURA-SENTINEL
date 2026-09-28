import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ExternalLink, 
  Play, 
  Zap, 
  Menu, 
  X, 
  Code2, 
  Lock, 
  Sliders, 
  Layers, 
  BarChart3, 
  Database,
  Terminal
} from 'lucide-react';

export default function Navbar({ onOpenJudgeMode, onLaunchPrototype, onSwitchToLegacy }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'The Problem', href: '#problem' },
    { label: 'Core Modules', href: '#modules' },
    { label: 'Dashboard Preview', href: '#dashboard' },
    { label: '0/1 Knapsack', href: '#optimizer' },
    { label: 'What-If Simulation', href: '#whatif' },
    { label: 'Blockchain Trust', href: '#blockchain' },
    { label: 'Tech Stack', href: '#techstack' },
    { label: 'Research', href: '#research' },
  ];

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#080D18]/90 backdrop-blur-xl border-b border-[#1F2E4D] shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-[#0B1220]/60 backdrop-blur-md border-b border-[#1F2E4D]/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <div className="w-full h-full bg-[#080D18] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-lg tracking-tight font-mono">
                  A.U.R.A. <span className="text-cyan-400">SENTINEL</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold tracking-wider">
                  SIH26105
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                Autonomous Unified Risk Analytics Platform
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1 lg:space-x-3 text-xs font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-2.5 py-1.5 rounded-md hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions & CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Judge Mode Button */}
            <button
              onClick={onOpenJudgeMode}
              className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 hover:border-amber-400 transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
              title="Quick 60-Second Overview for SIH Evaluators"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>JUDGE MODE</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1 py-0.2 rounded font-mono">60s</span>
            </button>

            {/* Launch Prototype CTA */}
            <button
              onClick={onLaunchPrototype}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>LIVE PROTOTYPE</span>
            </button>

            {/* GitHub Repo */}
            <a
              href="https://github.com/aryanbaghel756-spec/AURA-SENTINEL"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#16213A] border border-[#1F2E4D] text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
              title="View GitHub Repository"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onOpenJudgeMode}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30"
            >
              JUDGE MODE
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#080D18]/95 backdrop-blur-2xl border-b border-[#1F2E4D] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-3 py-2 rounded-lg bg-[#16213A]/50 border border-[#1F2E4D] text-slate-300 hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchPrototype();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH LIVE PROTOTYPE</span>
            </button>

            <a
              href="https://github.com/aryanbaghel756-spec/AURA-SENTINEL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-medium text-slate-300 bg-[#16213A] border border-[#1F2E4D]"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
