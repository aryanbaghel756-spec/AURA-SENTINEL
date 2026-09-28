import React from 'react';
import { 
  Coins, 
  TrendingDown, 
  ShieldAlert, 
  Clock, 
  Scale, 
  FileCheck, 
  ArrowRight, 
  Info,
  Layers
} from 'lucide-react';

export default function FinancialRiskSection({ onLaunchModule }) {
  const financialDrivers = [
    {
      title: 'Operational Downtime',
      icon: Clock,
      share: '45%',
      impact: '₹3.6L – ₹6.8L',
      desc: 'Estimated hourly revenue loss and engineer incident triage costs during critical port exploitation.'
    },
    {
      title: 'Incident Containment & Forensics',
      icon: ShieldAlert,
      share: '30%',
      impact: '₹2.4L – ₹4.5L',
      desc: 'Immediate emergency response, compromised system isolation, and root-cause evidence extraction.'
    },
    {
      title: 'Regulatory & Reputational Liability',
      icon: Scale,
      share: '25%',
      impact: '₹2.0L – ₹3.7L',
      desc: 'Compliance notifications, legal disclosures, and customer trust churn risk.'
    }
  ];

  return (
    <section id="financial-risk" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30">
            <Coins className="w-3.5 h-3.5" />
            <span>ACTUARIAL LOSS TRANSLATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            FINANCIAL RISK QUANTIFICATION
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Translating complex machine telemetry and CVSS threat severity into actionable monetary exposure for the C-suite
          </p>
        </div>

        {/* Visual Conversion Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] mb-12 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Stage 1: Technical Risk */}
            <div className="w-full lg:w-1/3 p-5 rounded-xl bg-[#16213A] border border-rose-500/40 text-center space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                INPUT: TECHNICAL CYBER RISK
              </span>
              <div className="text-3xl font-black font-mono text-rose-400">
                82 <span className="text-sm text-slate-400 font-sans">/ 100</span>
              </div>
              <p className="text-xs text-slate-300">
                4 Listening Ports &bull; Anomalous Memory Load &bull; MITRE T1021
              </p>
            </div>

            {/* Transition Arrow */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="hidden lg:flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30">
                <span>ACTUARIAL FORMULAS</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Stage 2: Potential Financial Exposure */}
            <div className="w-full lg:w-1/2 p-5 rounded-xl bg-gradient-to-br from-amber-950/30 to-[#16213A] border-2 border-amber-500/50 text-center space-y-2 relative">
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  *ILLUSTRATIVE PROTOTYPE OUTPUT
                </span>
              </div>

              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                OUTPUT: POTENTIAL FINANCIAL EXPOSURE
              </span>

              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-300">
                ₹8,00,000 – ₹15,00,000
              </div>

              <p className="text-xs text-slate-300">
                Median Liability Estimate: <strong>₹11.5 Lakhs</strong> &bull; Confidence: <strong>MEDIUM</strong>
              </p>
            </div>

          </div>
        </div>

        {/* Financial Impact Breakdown Drivers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {financialDrivers.map((driver) => {
            const Icon = driver.icon;
            return (
              <div
                key={driver.title}
                className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {driver.share} Exposure
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-mono">
                    {driver.title}
                  </h3>

                  <div className="text-sm font-bold font-mono text-slate-200 mt-1">
                    Modeled Loss: <span className="text-amber-300">{driver.impact}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                    {driver.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1F2E4D] text-[10px] font-mono text-slate-500">
                  Statistical Model Formulation
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Disclosure Banner */}
        <div className="p-4 rounded-xl bg-[#080D18] border border-amber-500/30 flex items-start space-x-3 text-xs font-mono text-amber-200/90">
          <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-amber-300 uppercase">Strict Evaluator Disclosure: </strong>
            Financial exposure values are model-based calculations designed to assist organizations in evaluating cybersecurity risk in monetary terms. They are never presented as measured real-world results or guaranteed actuarial losses.
          </div>
        </div>

      </div>
    </section>
  );
}
