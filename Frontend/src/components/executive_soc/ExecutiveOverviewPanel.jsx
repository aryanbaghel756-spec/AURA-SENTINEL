import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { 
  ShieldAlert, TrendingUp, Activity, DollarSign, RefreshCw, Sliders, CheckCircle2, Info 
} from 'lucide-react';
import { runMonteCarloSimulation } from './socData';

export default function ExecutiveOverviewPanel() {
  const [tef, setTef] = useState(14.0);
  const [sle, setSle] = useState(48.0);
  const [confidence, setConfidence] = useState(0.95);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSeed, setSimSeed] = useState(0);

  // Compute 10,000 Monte Carlo paths client-side
  const simulation = useMemo(() => {
    return runMonteCarloSimulation(tef, sle, 10000, confidence);
  }, [tef, sle, confidence, simSeed]);

  const handleReRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimSeed(prev => prev + 1);
      setIsSimulating(false);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* TOP VALUE-AT-RISK HERO CARD */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Actuarial Cyber Exposure // FAIR Standard (O-RT)</span>
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
              Enterprise Annual Cyber Value-at-Risk (VaR)
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Continuous 10,000-iteration Monte Carlo simulation modeling compound loss event frequency (LEF) 
              and lognormal financial loss magnitude (LM) across all 142 enterprise assets.
            </p>
          </div>

          {/* Big ₹ Crore VaR Display */}
          <div className="bg-[#0B1220]/80 border border-cyan-500/30 rounded-xl px-7 py-5 flex flex-col items-start lg:items-end justify-center min-w-[280px]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              {Math.round(confidence * 100)}% Confidence Annual VaR
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-cyan-400 font-extrabold text-3xl sm:text-4xl tracking-tight">
                ₹{simulation.var_crores}
              </span>
              <span className="text-slate-300 text-lg font-semibold">Crores</span>
            </div>
            <span className="text-emerald-400 text-xs font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Empirically computed from 10k sample paths
            </span>
          </div>
        </div>

        {/* 4 CORE KPI METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#1F2E4D]">
          <div className="bg-[#0B1220]/60 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Expected Annual Loss (ALE)</span>
            <span className="text-white font-bold text-xl sm:text-2xl mt-1 block">
              ₹{simulation.ale_crores} <span className="text-xs text-slate-400 font-normal">Cr/yr</span>
            </span>
            <span className="text-slate-400 text-xs mt-1 block">Mean annualized exposure</span>
          </div>

          <div className="bg-[#0B1220]/60 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Threat Frequency (TEF)</span>
            <span className="text-amber-400 font-bold text-xl sm:text-2xl mt-1 block">
              {tef.toFixed(1)} <span className="text-xs text-slate-400 font-normal">events/yr</span>
            </span>
            <span className="text-slate-400 text-xs mt-1 block">Poisson process mean</span>
          </div>

          <div className="bg-[#0B1220]/60 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Median Single Loss (SLE)</span>
            <span className="text-violet-400 font-bold text-xl sm:text-2xl mt-1 block">
              ₹{sle.toFixed(0)} <span className="text-xs text-slate-400 font-normal">Lakhs</span>
            </span>
            <span className="text-slate-400 text-xs mt-1 block">Lognormal scale (μ={Math.log(sle).toFixed(2)})</span>
          </div>

          <div className="bg-[#0B1220]/60 p-4 rounded-lg border border-[#1F2E4D]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">Monte Carlo Samples</span>
            <span className="text-emerald-400 font-bold text-xl sm:text-2xl mt-1 block">
              10,000 <span className="text-xs text-slate-400 font-normal">runs</span>
            </span>
            <span className="text-slate-400 text-xs mt-1 block">Box-Muller lognormal transform</span>
          </div>
        </div>
      </div>

      {/* MONTE CARLO LOSS-EXCEEDANCE CURVE & INTERACTIVE PARAMETERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART: LOSS EXCEEDANCE CURVE (2 Columns) */}
        <div className="lg:col-span-2 bg-[#16213A] border border-[#1F2E4D] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F2E4D] gap-2">
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Monte Carlo Loss Exceedance Curve (LEC)
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Probability of enterprise financial loss exceeding threshold X in a 1-year operational window.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-cyan-400"></span>
                Exceedance Probability (%)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <span className="w-3 h-0.5 bg-rose-400"></span>
                95% VaR: ₹{simulation.var_crores} Cr
              </span>
            </div>
          </div>

          {/* Recharts Curve */}
          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulation.curve} margin={{ top: 15, right: 25, left: 0, bottom: 25 }}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0B1220" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2E4D" vertical={false} />
                <XAxis 
                  dataKey="loss_crores" 
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                  label={{ value: 'Financial Loss Exposure (₹ Crores)', position: 'insideBottom', offset: -15, fill: '#94A3B8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 100]}
                  unit="%"
                  label={{ value: 'Probability of Exceedance', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1220', borderColor: '#22D3EE', borderRadius: '8px', color: '#FFF', fontSize: '13px' }}
                  formatter={(value, name) => [`${value}%`, 'Exceedance Probability']}
                  labelFormatter={(label) => `Loss Threshold: ₹${label} Crores`}
                />
                <ReferenceLine 
                  x={simulation.var_crores} 
                  stroke="#F43F5E" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{ 
                    value: `95% VaR: ₹${simulation.var_crores} Cr`, 
                    fill: '#F43F5E', 
                    position: 'top', 
                    fontSize: 12,
                    fontWeight: 'bold' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#22D3EE" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#cyanGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 bg-[#0B1220] p-3 rounded-lg border border-[#1F2E4D] mt-2">
            <span>Formula: <code className="text-cyan-400 font-mono">P(Loss ≥ x) = 1 - F_Loss(x)</code></span>
            <span className="text-slate-300">Statistical Tail: 95th Percentile = 5% Annual Breach Exceedance Risk</span>
          </div>
        </div>

        {/* CONTROLS: INTERACTIVE SIMULATION PARAMETERS (1 Column) */}
        <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 pb-4 border-b border-[#1F2E4D]">
              <Sliders className="w-5 h-5 text-amber-400" />
              FAIR Actuarial Inputs
            </h2>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Adjust threat event frequency and loss scale to re-quantify 10,000 Monte Carlo paths in real-time.
            </p>

            <div className="space-y-5 mt-5">
              {/* SLIDER 1: TEF */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Threat Frequency (TEF)</span>
                  <span className="text-amber-400 font-bold">{tef.toFixed(1)} events/yr</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="40" 
                  step="0.5"
                  value={tef}
                  onChange={(e) => setTef(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#0B1220] rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>2/yr (Low)</span>
                  <span>20/yr (Moderate)</span>
                  <span>40/yr (Critical)</span>
                </div>
              </div>

              {/* SLIDER 2: SLE */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Median Loss Magnitude (SLE)</span>
                  <span className="text-violet-400 font-bold">₹{sle.toFixed(0)} Lakhs</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  step="5"
                  value={sle}
                  onChange={(e) => setSle(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#0B1220] rounded-lg appearance-none cursor-pointer accent-violet-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹10L</span>
                  <span>₹75L</span>
                  <span>₹150L</span>
                </div>
              </div>

              {/* CONFIDENCE LEVEL SELECTOR */}
              <div>
                <label className="text-slate-300 text-xs font-medium block mb-1.5">Board Confidence Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0.90, 0.95, 0.99].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setConfidence(lvl)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                        confidence === lvl 
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20' 
                          : 'bg-[#0B1220] border-[#1F2E4D] text-slate-400 hover:text-white'
                      }`}
                    >
                      {Math.round(lvl * 100)}% VaR
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RE-SIMULATE BUTTON */}
          <div className="mt-6 pt-4 border-t border-[#1F2E4D]">
            <button
              onClick={handleReRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.99]"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Simulating 10,000 Paths...' : 'Re-Run 10,000 Iterations'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Runs client-side in pure JS in &lt;15ms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
