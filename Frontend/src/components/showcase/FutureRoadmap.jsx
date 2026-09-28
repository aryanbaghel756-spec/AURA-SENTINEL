import React from 'react';
import { 
  Milestone, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  FileCheck, 
  Layers, 
  TrendingUp, 
  Cpu, 
  AlertCircle 
} from 'lucide-react';

export default function FutureRoadmap() {
  const roadmapItems = [
    {
      num: '01',
      title: 'FAIR-BASED QUANTITATIVE RISK METHODOLOGY',
      standard: 'Factor Analysis of Information Risk (Open FAIR™)',
      description: 'Formal integration of Loss Event Frequency (LEF) and Loss Magnitude (LM) probabilistic Monte Carlo distributions to replace heuristic financial bounds.',
      horizon: 'Phase 2 Architecture'
    },
    {
      num: '02',
      title: 'NIST CSF 2.0 AUTOMATED MAPPING',
      standard: 'NIST Cybersecurity Framework 2.0',
      description: 'Dynamic bidirectional alignment across Govern, Identify, Protect, Detect, Respond, and Recover tiers based on active system telemetry.',
      horizon: 'Enterprise Expansion'
    },
    {
      num: '03',
      title: 'NIST SP 800-30 RISK ASSESSMENT LAYER',
      standard: 'Risk Assessment Guidelines for Federal Info Systems',
      description: 'Standardized threat event cataloging, vulnerability pairing, and structured likelihood/impact matrices matching federal compliance requirements.',
      horizon: 'Phase 2 Architecture'
    },
    {
      num: '04',
      title: 'CIS CONTROLS V8 MAPPING',
      standard: 'Center for Internet Security (IG1 / IG2 / IG3)',
      description: 'Automated policy audit scripts verifying adherence to CIS benchmark baselines for endpoint configuration, port binding, and access hygiene.',
      horizon: 'Compliance Suite'
    },
    {
      num: '05',
      title: 'ISO/IEC 27001 CONTROL MAPPING',
      standard: 'ISO/IEC 27001:2022 Information Security',
      description: 'Annex A organizational and technological control cross-referencing to automatically generate external compliance audit logs.',
      horizon: 'Compliance Suite'
    },
    {
      num: '06',
      title: 'ADAPTIVE AI RISK PREDICTION WITH HISTORICAL TELEMETRY',
      standard: 'Bayesian Time-Series & Deep Sequence Modeling',
      description: 'Long-term telemetry indexing to predict vulnerability emergence and anomalous degradation weeks before weaponization.',
      horizon: 'Research & Innovation'
    }
  ];

  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase text-amber-300 bg-amber-500/10 border border-amber-500/30">
            <Milestone className="w-3.5 h-3.5" />
            <span>NEXT EVOLUTION &bull; FUTURE ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            FUTURE ROADMAP
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Prospective enterprise governance standards and probabilistic risk methodologies planned for post-hackathon scaling
          </p>
        </div>

        {/* High-Visibility Distinction Notice Banner */}
        <div className="mb-12 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start space-x-3 text-xs font-mono text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-amber-300 uppercase">Strict Architectural Scope Disclosure: </strong>
            The capabilities in this section represent the <strong>FUTURE DEVELOPMENT ROADMAP</strong>. They are NOT claimed as currently implemented features in the working hackathon build. The current implementation is strictly defined by the 8 Core Intelligence Modules documented above.
          </div>
        </div>

        {/* 6 Roadmap Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item) => (
            <div
              key={item.num}
              className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] relative flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-600">
                    {item.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#16213A] text-amber-300 border border-[#1F2E4D]">
                    {item.horizon}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                  {item.standard}
                </span>

                <h3 className="text-sm font-bold text-white font-mono tracking-tight mb-3">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1F2E4D]/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Scheduled Horizon</span>
                </span>
                <span className="text-amber-400 font-semibold">Planned</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
