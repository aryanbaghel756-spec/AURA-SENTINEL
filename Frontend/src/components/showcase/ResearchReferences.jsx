import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Eye, 
  Shield, 
  Activity, 
  Cpu, 
  Lock, 
  Bot,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ResearchReferences() {
  const references = [
    {
      id: 'yolo',
      name: 'YOLOv8',
      topic: 'Real-time Object Detection',
      authority: 'Ultralytics',
      icon: Eye,
      description: 'State-of-the-art vision architecture utilized for operator presence verification and physical workstation boundary surveillance.',
      url: 'https://docs.ultralytics.com/models/yolov8/',
      category: 'Computer Vision',
      citation: 'Jocher et al. (2023) Ultralytics YOLOv8 Documentation'
    },
    {
      id: 'mitre',
      name: 'MITRE ATT&CK®',
      topic: 'Attack Technique & Threat Mapping',
      authority: 'MITRE Corporation',
      icon: Shield,
      description: 'Globally accessible knowledge base of adversary tactics and techniques used for normalizing anomalous telemetry into standardized threat vectors.',
      url: 'https://attack.mitre.org/',
      category: 'Threat Taxonomy',
      citation: 'MITRE ATT&CK Enterprise Matrix v14'
    },
    {
      id: 'psutil',
      name: 'psutil',
      topic: 'System & Network Telemetry',
      authority: 'Giampaolo Rodola',
      icon: Activity,
      description: 'Cross-platform process and system monitoring library providing real-time CPU, RAM, disk I/O, network socket, and hardware sensor telemetry.',
      url: 'https://psutil.readthedocs.io/en/stable/',
      category: 'Kernel Telemetry',
      citation: 'Rodola, G. (2009–2024) psutil official documentation'
    },
    {
      id: 'knapsack',
      name: '0/1 Knapsack DP',
      topic: 'Budget-Constrained Investment Optimization',
      authority: 'Old Dominion University CS',
      icon: Cpu,
      description: 'Foundational algorithmic formulation solving discrete portfolio selection under strict budget constraints via dynamic programming table recurrence.',
      url: 'https://www.cs.odu.edu/~zeil/cs361/f25-web/Public/knapsack/index.html',
      category: 'Algorithm Theory',
      citation: 'Zeil, S.J. (2025) Dynamic Programming Algorithms'
    },
    {
      id: 'sha256',
      name: 'NIST SHA-256',
      topic: 'Secure Hash Standard (FIPS 180-4)',
      authority: 'National Institute of Standards & Technology',
      icon: Lock,
      description: 'Federal Information Processing Standard defining the cryptographic hash function utilized across AURA Merkle audit chains for tamper detection.',
      url: 'https://csrc.nist.gov/pubs/fips/180-4/upd1/final',
      category: 'Cryptographic Standard',
      citation: 'NIST FIPS PUB 180-4 (Revised 2015)'
    },
    {
      id: 'groq',
      name: 'Groq LPU™ Engine',
      topic: 'LLM / AI Assistant Infrastructure',
      authority: 'Groq Inc.',
      icon: Bot,
      description: 'Language Processing Unit tensor architecture delivering sub-second deterministic inference latency for conversational cyber risk guidance.',
      url: 'https://console.groq.com/docs/',
      category: 'Inference Architecture',
      citation: 'Groq Cloud Platform & LPU Hardware Architecture'
    }
  ];

  return (
    <section id="research" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1220] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ACADEMIC &amp; ENGINEERING FOUNDATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            RESEARCH &amp; REFERENCES
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Theoretical benchmarks, federal security standards, and formal academic algorithms underpinning AURA Sentinel
          </p>
        </div>

        {/* 6 Research & Reference Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {references.map((ref) => {
            const Icon = ref.icon;
            return (
              <div
                key={ref.id}
                className="group relative p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)] hover:-translate-y-1"
              >
                <div>
                  {/* Category and Authority Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                      {ref.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {ref.authority}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#16213A] border border-[#1F2E4D] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-mono">
                        {ref.name}
                      </h3>
                      <div className="text-xs text-cyan-300 font-mono">
                        &rarr; {ref.topic}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3">
                    {ref.description}
                  </p>
                </div>

                {/* Citation & Official Link Button */}
                <div className="pt-4 mt-4 border-t border-[#1F2E4D]/80 space-y-3">
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    Ref: {ref.citation}
                  </div>

                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono font-bold text-slate-200 bg-[#16213A] border border-[#1F2E4D] hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer group-hover:border-cyan-400"
                  >
                    <span>OFFICIAL DOCUMENTATION</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
