import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  ShieldAlert, 
  Coins, 
  Sliders, 
  Cpu, 
  Link2, 
  Play, 
  CheckCircle2, 
  Layers, 
  Activity,
  ArrowRight
} from 'lucide-react';

export default function JudgeModeModal({ isOpen, onClose, onLaunchPrototype }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'problem',
      stepNum: '01 / 08',
      title: 'THE ENTERPRISE PROBLEM',
      badge: 'PROBLEM STATEMENT: SIH26105',
      badgeColor: 'rose',
      icon: ShieldAlert,
      headline: 'Cyber Alarms Lack Financial Context; Budgets Are Spent Arbitrarily',
      points: [
        'Enterprises manage 50+ siloed security tools with no unified telemetry correlation.',
        'Technical CVSS scores (e.g. 8.2) fail to inform CFOs and boards of real monetary loss exposure.',
        'Budget allocation relies on static vendor packages rather than mathematical optimization.'
      ],
      diagram: [
        { label: 'Siloed Tools', sub: 'Fragmented Logs' },
        { label: 'Raw CVSS 8.2', sub: 'No Financial Context' },
        { label: 'Arbitrary Budget', sub: 'Guesswork Spend' }
      ]
    },
    {
      id: 'solution',
      stepNum: '02 / 08',
      title: 'AURA SENTINEL SOLUTION',
      badge: 'UNIFIED ARCHITECTURE',
      badgeColor: 'cyan',
      icon: Layers,
      headline: 'From Fragmented Telemetry to Budget-Optimal Cyber Decisions',
      points: [
        'Continuous ingestion of live system, port, and process telemetry.',
        'Algorithmic translation of technical risk into modeled financial exposure ranges.',
        '0/1 Knapsack Dynamic Programming solver allocating defensive controls strictly within budget.',
        'Every telemetry alert and allocation decision sealed in a tamper-evident SHA-256 ledger.'
      ],
      diagram: [
        { label: 'Host Telemetry', sub: 'psutil + OS APIs' },
        { label: 'Financial Engine', sub: 'Loss Modeling' },
        { label: '0/1 Knapsack DP', sub: 'Budget Optimization' },
        { label: 'Audit Chain', sub: 'SHA-256 Ledger' }
      ]
    },
    {
      id: 'stack',
      stepNum: '03 / 08',
      title: 'BUILT & VERIFIED TECH STACK',
      badge: 'CORE IMPLEMENTATION',
      badgeColor: 'blue',
      icon: Activity,
      headline: 'Fast, Native, Autonomous Microservices Running Locally',
      points: [
        'Backend: Python 3.10 + FastAPI asynchronous REST & WebSocket service.',
        'Frontend: Modern React 19 client with Tailwind CSS dark SOC design system.',
        'Telemetry: Real-time kernel monitoring via psutil (CPU, RAM, I/O, Listening Sockets).',
        'Intelligence: MITRE ATT&CK Enterprise taxonomy mapping + Groq LPU LLM co-pilot.'
      ],
      diagram: [
        { label: 'FastAPI Backend', sub: 'Python 3.10' },
        { label: 'React 19 Frontend', sub: 'Tailwind CSS' },
        { label: 'psutil Telemetry', sub: '1s Polling' },
        { label: 'Groq Cloud AI', sub: 'Low-latency LLM' }
      ]
    },
    {
      id: 'financial',
      stepNum: '04 / 08',
      title: 'FINANCIAL RISK ENGINE',
      badge: 'MONETARY LOSS MODELING',
      badgeColor: 'amber',
      icon: Coins,
      headline: 'Quantifying Technical Cyber Severity into Board-Level Rupee Exposure',
      points: [
        'Bridges the communication gap between technical SOC operators and executive boards.',
        'Converts technical risk (82/100) into estimated enterprise liability (₹8L – ₹15L).',
        'Model-based exposure calculation incorporating downtime, breach response, and liabilities.',
        '*Clearly labeled as an Illustrative Prototype Output.'
      ],
      diagram: [
        { label: 'Risk Score 82/100', sub: 'Technical Severity' },
        { label: 'Loss Formulas', sub: 'Downtime + Incident' },
        { label: '₹8L – ₹15L', sub: 'Illustrative Output' }
      ]
    },
    {
      id: 'whatif',
      stepNum: '05 / 08',
      title: 'WHAT-IF WARGAME SIMULATOR',
      badge: 'PROACTIVE STRESS-TESTING',
      badgeColor: 'violet',
      icon: Sliders,
      headline: 'Dynamic Scenario Modeling Before Attacks Occur in the Wild',
      points: [
        'Interactive control sliders for open ports, threat signals, and compute resource saturation.',
        'Instant live delta comparison between operational baseline and hypothetical threat vectors.',
        'Allows CISOs to justify proactive security spending before incident manifestation.',
        '*Scenario outputs are model-based simulations.'
      ],
      diagram: [
        { label: 'Baseline (82 Risk)', sub: '₹8L Exposure' },
        { label: 'Port Spike (+12)', sub: 'Simulated Infiltration' },
        { label: 'Scenario (94 Risk)', sub: '₹14.2L Exposure' }
      ]
    },
    {
      id: 'optimizer',
      stepNum: '06 / 08',
      title: '0/1 KNAPSACK BUDGET OPTIMIZER',
      badge: 'MATHEMATICAL OPTIMALITY',
      badgeColor: 'emerald',
      icon: Cpu,
      headline: 'Strict Dynamic Programming Solving Non-Fractional Defense Allocation',
      points: [
        'Eliminates greedy value-to-cost heuristics and arbitrary vendor bundles.',
        'Dynamic programming recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-c_i] + v_i).',
        'State backtracker strictly guarantees: ∑ cost_i ≤ Budget (W) in real INR.',
        'Discrete 0/1 invariant: Each candidate defense control selected at most once (x_i ∈ {0, 1}).'
      ],
      diagram: [
        { label: 'Budget ₹10,00,000', sub: 'Hard Ceiling' },
        { label: '2D DP Table', sub: 'O(N × W) Recurrence' },
        { label: 'Backtracker', sub: 'Exact Subset Recovery' },
        { label: 'Optimal Defense', sub: 'Max Risk Reduction' }
      ]
    },
    {
      id: 'blockchain',
      stepNum: '07 / 08',
      title: 'BLOCKCHAIN AUDIT LEDGER',
      badge: 'TAMPER-EVIDENT INTEGRITY',
      badgeColor: 'teal',
      icon: Link2,
      headline: 'Cryptographic SHA-256 Merkle Chaining for Forensic Non-Repudiation',
      points: [
        'Every optimization decision, telemetry spike, and operator action is cryptographically sealed.',
        'SHA-256 hashing + Merkle root compression binds each block to its predecessor.',
        'Single-node tamper-evident audit ledger: Any byte alteration breaks the cryptographic hash.',
        'Live tamper demonstration proves immediate cryptographic mismatch detection.'
      ],
      diagram: [
        { label: 'Decision Event', sub: 'Payload Data' },
        { label: 'SHA-256 Hash', sub: 'Cryptographic Link' },
        { label: 'Merkle Root', sub: 'Batch Verification' },
        { label: 'Ledger Verified', sub: 'Tamper-Evident' }
      ]
    },
    {
      id: 'demo',
      stepNum: '08 / 08',
      title: 'READY FOR EVALUATION',
      badge: 'LIVE WORKING PROTOTYPE',
      badgeColor: 'cyan',
      icon: Play,
      headline: 'Experience AURA Sentinel Live in Action',
      points: [
        'Explore the full Executive SOC Console and interactive command center.',
        'Test real-time slider updates on the 0/1 Knapsack DP Budget Optimizer.',
        'Simulate attack scenarios with the What-If Wargame Simulator.',
        'Inspect the live SHA-256 blockchain ledger and test tamper detection.'
      ],
      diagram: [
        { label: 'Executive SOC', sub: 'Single-Pane View' },
        { label: 'Live Telemetry', sub: 'Host Streaming' },
        { label: 'Budget DP Tool', sub: 'Interactive Sliders' },
        { label: 'Ready to Grade', sub: 'SIH 2026' }
      ]
    }
  ];

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0F172A] border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(34,211,238,0.3)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#080D18] border-b border-[#1F2E4D] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  SIH 2026 JUDGE WALKTHROUGH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  60-SECOND SPEED-RUN
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                A.U.R.A. Sentinel &bull; Problem Statement SIH26105 &bull; Team ByteForce_1
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {current.stepNum}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#16213A] border border-[#1F2E4D] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Step Tag & Title */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                {current.badge}
              </span>
              <span className="text-slate-500 text-xs font-mono">&bull;</span>
              <span className="text-xs font-mono text-slate-400">{current.title}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {current.headline}
            </h3>
          </div>

          {/* Flow Diagram Mini-Strip */}
          <div className="p-4 rounded-xl bg-[#080D18] border border-[#1F2E4D]">
            <div className="text-[10px] font-mono uppercase text-slate-500 mb-2 font-bold">
              ARCHITECTURE SCHEMATIC
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {current.diagram.map((d, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#16213A] border border-[#1F2E4D] text-center">
                  <div className="text-xs font-bold font-mono text-cyan-300 truncate">
                    {d.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans truncate">
                    {d.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Bullet Points */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">
              CORE EVALUATOR TAKEAWAYS
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {current.points.map((pt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#16213A]/50 border border-[#1F2E4D] flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Bottom Navigation */}
        <div className="p-4 sm:p-5 bg-[#080D18] border-t border-[#1F2E4D] flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-600 bg-[#16213A]'
                : 'text-slate-300 bg-[#16213A] hover:bg-slate-800 hover:text-white border border-[#1F2E4D] cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREVIOUS</span>
          </button>

          {/* Quick Step Indicators */}
          <div className="hidden sm:flex items-center space-x-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-6 bg-cyan-400 shadow-md shadow-cyan-400/50'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md shadow-cyan-400/30 cursor-pointer"
            >
              <span>NEXT STEP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onLaunchPrototype();
              }}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH LIVE PROTOTYPE ⚡</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
