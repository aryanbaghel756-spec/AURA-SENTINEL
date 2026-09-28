import React, { useState } from 'react';
import { 
  Link2, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Key, 
  Database,
  RefreshCw,
  Terminal,
  Layers
} from 'lucide-react';

export default function BlockchainSection() {
  const [isTampered, setIsTampered] = useState(false);

  // Normal vs Tampered cryptographic blocks
  const block47 = {
    index: 47,
    timestamp: '2026-09-28 22:14:02 UTC',
    data: isTampered 
      ? 'MALICIOUS_MODIFICATION: Budget Override ₹50,00,000 [UNAUTHORIZED]'
      : 'AUDIT_EVENT: Knapsack DP Portfolio Allocation ₹10,00,000',
    prevHash: '0000e4789ab1029c3d4f8201a938b7201c89f2a08316ecb1928374a58910bc41',
    hash: isTampered 
      ? '8f92bd3a0984f183726489bca719283a0098fbc1827463529a8b1c09283746a5' // Non-PoW corrupt hash
      : '0000a39f1c7e92b8d4f056a2e8813bc58d1976f0c4327ab31e847c1a8e19d5b7',
    merkleRoot: isTampered ? 'a918f...[MUTATED]' : 'e2b40...[VERIFIED]',
    nonce: isTampered ? '7491 [INVALID]' : '148209 [VALID POW]'
  };

  const block48 = {
    index: 48,
    timestamp: '2026-09-28 22:15:30 UTC',
    data: 'SECURITY_ALERT: External Port 3389 Scanned • MITRE T1021',
    prevHash: '0000a39f1c7e92b8d4f056a2e8813bc58d1976f0c4327ab31e847c1a8e19d5b7',
    hash: '0000f72a81b3ce99120de840938f71295b9c40217ea96b01538fcda45279b921',
    merkleRoot: 'c7891...[VERIFIED]',
    nonce: '94218 [VALID POW]'
  };

  const isChainBroken = isTampered && block47.hash !== block48.prevHash;

  return (
    <section id="blockchain" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#080D18] relative border-t border-[#1F2E4D]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
            <Link2 className="w-3.5 h-3.5" />
            <span>CRYPTOGRAPHIC ACCOUNTABILITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            BLOCKCHAIN TRUST LAYER
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Tamper-Evident SHA-256 Merkle Audit Chain preserving forensic integrity of security telemetry &amp; decisions
          </p>
        </div>

        {/* 6-STEP CRYPTOGRAPHIC SEQUENCE FLOW */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] mb-12 shadow-xl">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">
            CRYPTOGRAPHIC VERIFICATION FLOW
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'EVENT INGEST', desc: 'Security decision or telemetry alert' },
              { step: '02', title: 'SHA-256 HASH', desc: 'Standardized payload hashing' },
              { step: '03', title: 'PREVIOUS HASH', desc: 'Parent link cryptographic binding' },
              { step: '04', title: 'MERKLE ROOT', desc: 'Binary tree batch compression' },
              { step: '05', title: 'PROOF-OF-WORK', desc: 'Leading-zero nonce validation' },
              { step: '06', title: 'INTEGRITY VERIFY', desc: 'Automated chain consistency scan' },
            ].map((st, idx) => (
              <div key={st.step} className="p-3.5 rounded-xl bg-[#16213A] border border-[#1F2E4D] space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                  STEP {st.step}
                </span>
                <div className="text-xs font-bold font-mono text-white">
                  {st.title}
                </div>
                <div className="text-[11px] text-slate-400 font-sans leading-tight">
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATUS & TAMPER DEMONSTRATION CONTROLLER */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-[#0F172A] border border-[#1F2E4D] mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3.5 h-3.5 rounded-full ${isChainBroken ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase">LEDGER INTEGRITY STATUS:</div>
              <div className={`text-base font-mono font-bold ${isChainBroken ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isChainBroken ? 'ALERT: CRYPTOGRAPHIC HASH MISMATCH DETECTED' : 'LEDGER STATUS: VERIFIED • 0 CORRUPTIONS'}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Toggle */}
          <button
            onClick={() => setIsTampered(!isTampered)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              isTampered
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500 shadow-md shadow-rose-500/20'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isTampered ? 'RESET TAMPER SIMULATION' : 'SIMULATE TELEMETRY TAMPERING'}</span>
          </button>
        </div>

        {/* LIVE BLOCK CHAIN VISUALIZATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BLOCK 47 */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 space-y-4 font-mono text-xs ${
            isTampered 
              ? 'bg-rose-950/20 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.25)]' 
              : 'bg-[#0F172A] border-[#1F2E4D]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-3">
              <span className="font-bold text-white text-sm">BLOCK #{block47.index}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isTampered ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {isTampered ? 'TAMPERED STATE' : 'MINED & SEALED'}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-500 text-[10px] block">PAYLOAD DATA:</span>
                <div className={`p-2 rounded font-mono ${isTampered ? 'bg-rose-900/40 text-rose-200 font-bold' : 'bg-[#16213A] text-slate-200'}`}>
                  {block47.data}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">PREVIOUS BLOCK HASH:</span>
                <div className="p-2 rounded bg-[#080D18] text-slate-400 break-all text-[11px]">
                  {block47.prevHash}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">COMPUTED SHA-256 BLOCK HASH:</span>
                <div className={`p-2 rounded break-all text-[11px] font-bold ${
                  isTampered ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-[#080D18] text-cyan-300'
                }`}>
                  {block47.hash}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1F2E4D]">
                <span>Proof-of-Work Nonce: <strong className="text-slate-200">{block47.nonce}</strong></span>
                <span>Timestamp: {block47.timestamp}</span>
              </div>
            </div>
          </div>

          {/* BLOCK 48 */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#1F2E4D] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-3">
              <span className="font-bold text-white text-sm">BLOCK #{block48.index} (LATEST)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300">
                ACTIVE HEAD
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-500 text-[10px] block">PAYLOAD DATA:</span>
                <div className="p-2 rounded bg-[#16213A] text-slate-200">
                  {block48.data}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">EXPECTED PARENT HASH (Must match Block #47):</span>
                <div className={`p-2 rounded break-all text-[11px] ${
                  isChainBroken ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 font-bold' : 'bg-[#080D18] text-emerald-400'
                }`}>
                  {block48.prevHash}
                </div>
              </div>

              {isChainBroken && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500 text-rose-200 text-xs font-bold flex items-center space-x-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>MISMATCH: Block #47 Hash ≠ Block #48 PrevHash! Parent link fractured!</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 text-[10px] block">BLOCK #48 SHA-256 HASH:</span>
                <div className="p-2 rounded bg-[#080D18] text-cyan-300 break-all text-[11px]">
                  {block48.hash}
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1F2E4D]">
                <span>Proof-of-Work Nonce: <strong className="text-slate-200">{block48.nonce}</strong></span>
                <span>Timestamp: {block48.timestamp}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Rigorous Engineering Definition */}
        <div className="mt-8 p-4 rounded-xl bg-[#0F172A] border border-[#1F2E4D] text-xs font-mono text-slate-400 space-y-1">
          <div className="text-slate-300 font-bold uppercase">
            Defensive Architecture Specification:
          </div>
          <p className="leading-relaxed">
            The AURA Sentinel blockchain layer operates as a <strong>Tamper-Evident Audit Ledger</strong> utilizing standard cryptographic SHA-256 chaining and Merkle trees. It guarantees that any post-incident tampering with historical telemetry or algorithmic investment records is mathematically detectable within 1 CPU cycle. It does not utilize distributed consensus algorithms (such as Raft or Byzantine Fault Tolerance) and is strictly designed for immutable local forensic accountability.
          </p>
        </div>

      </div>
    </section>
  );
}
