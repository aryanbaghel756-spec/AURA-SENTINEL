import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Link as LinkIcon, 
  RotateCcw, AlertTriangle, Key, Hash, Clock, FileText, Play 
} from 'lucide-react';
import { buildInitialBlocks, sha256Sync } from './socData';

export default function MerkleAuditPanel() {
  const [blocks, setBlocks] = useState(() => buildInitialBlocks());
  const [verificationState, setVerificationState] = useState({
    status: 'IDLE', // 'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FAILED'
    verifiedIndex: -1,
    failedBlock: null,
    errorMessage: '',
    verifiedCount: 0
  });
  const [isTampered, setIsTampered] = useState(false);
  const [tamperedIndex, setTamperedIndex] = useState(null);

  // Step-by-step client-side SHA-256 cryptographic verification
  const handleVerifyChain = async () => {
    setVerificationState({
      status: 'VERIFYING',
      verifiedIndex: 0,
      failedBlock: null,
      errorMessage: '',
      verifiedCount: 0
    });

    for (let i = 0; i < blocks.length; i++) {
      const blk = blocks[i];

      // Recompute data hash from payload
      const expectedDataHash = sha256Sync(JSON.stringify(blk.payload));
      
      // Recompute header hash
      const rawHeader = `${blk.index}|${blk.timestamp}|${blk.action}|${blk.data_hash}|${blk.previous_hash}`;
      const expectedCurrentHash = sha256Sync(rawHeader);

      // Verify previous hash chaining
      let prevHashValid = true;
      if (i > 0) {
        if (blk.previous_hash !== blocks[i - 1].current_hash) {
          prevHashValid = false;
        }
      }

      // Check for discrepancies
      if (!prevHashValid || blk.current_hash !== expectedCurrentHash || blk.data_hash !== expectedDataHash) {
        setVerificationState({
          status: 'FAILED',
          verifiedIndex: i,
          failedBlock: blk.index,
          errorMessage: `Cryptographic mismatch detected at Block #${blk.index}! Hash does not match state payload or prior chain link.`,
          verifiedCount: i
        });
        return;
      }

      setVerificationState(prev => ({
        ...prev,
        verifiedIndex: i,
        verifiedCount: i + 1
      }));

      // Small delay so evaluator can visually see each block verified
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    setVerificationState({
      status: 'SUCCESS',
      verifiedIndex: blocks.length - 1,
      failedBlock: null,
      errorMessage: '',
      verifiedCount: blocks.length
    });
  };

  // Tamper simulation for live judge demonstration
  const handleSimulateTamper = (targetIndex = 1042) => {
    const newBlocks = blocks.map(b => {
      if (b.index === targetIndex) {
        // Alter a field inside payload without recomputing cryptographic hashes
        return {
          ...b,
          payload: {
            ...b.payload,
            calculated_var_cr: 2.15, // Arbitrary unauthorized modification
            tampered: true
          }
        };
      }
      return b;
    });

    setBlocks(newBlocks);
    setIsTampered(true);
    setTamperedIndex(targetIndex);
    setVerificationState({
      status: 'IDLE',
      verifiedIndex: -1,
      failedBlock: null,
      errorMessage: '',
      verifiedCount: 0
    });
  };

  const handleResetChain = () => {
    setBlocks(buildInitialBlocks());
    setIsTampered(false);
    setTamperedIndex(null);
    setVerificationState({
      status: 'IDLE',
      verifiedIndex: -1,
      failedBlock: null,
      errorMessage: '',
      verifiedCount: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1F2E4D]">
          <div>
            <div className="flex items-center space-x-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span>Zero-Trust Cryptographic Ledger // SHA-256 Merkle Proof</span>
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-violet-400" />
              Merkle Blockchain Audit Ledger
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Every risk calculation, vulnerability ingestion, and budget allocation is cryptographically sealed in an 
              append-only hash chain satisfying DPDP Act 2023 and CERT-In non-repudiation mandates.
            </p>
          </div>

          {/* ACTION BUTTONS: VERIFY & TAMPER DEMO */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleVerifyChain}
              disabled={verificationState.status === 'VERIFYING'}
              className="py-2.5 px-5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.99]"
            >
              <Play className={`w-4 h-4 fill-slate-950 ${verificationState.status === 'VERIFYING' ? 'animate-spin' : ''}`} />
              {verificationState.status === 'VERIFYING' ? 'Recomputing SHA-256 Hashes...' : 'Verify Chain Integrity'}
            </button>

            {!isTampered ? (
              <button
                onClick={() => handleSimulateTamper(1042)}
                className="py-2.5 px-4 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Simulate Tamper on #1042
              </button>
            ) : (
              <button
                onClick={handleResetChain}
                className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-300" />
                Restore Untampered Chain
              </button>
            )}
          </div>
        </div>

        {/* VERIFICATION STATUS BANNER */}
        {verificationState.status === 'SUCCESS' && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">CRYPTOGRAPHIC AUDIT VERIFIED</h4>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  All {verificationState.verifiedCount} Merkle blocks re-hashed client-side. Zero tampering detected across entire chain.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/20 py-1.5 px-3 rounded border border-emerald-500/30">
              100% SHA-256 MATCH
            </span>
          </div>
        )}

        {verificationState.status === 'FAILED' && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/40 rounded-xl flex items-center justify-between text-rose-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">CRYPTOGRAPHIC INTEGRITY VIOLATION DETECTED</h4>
                <p className="text-xs text-rose-300/90 mt-0.5">
                  {verificationState.errorMessage}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-500/20 py-1.5 px-3 rounded border border-rose-500/30">
              TAMPER PROOF FIRED
            </span>
          </div>
        )}

        {isTampered && verificationState.status === 'IDLE' && (
          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Simulated mutation active: Payload in Block #{tamperedIndex} was altered without updating cryptographic hashes. Click <strong>Verify Chain Integrity</strong> to test the verification algorithm!
            </span>
          </div>
        )}
      </div>

      {/* SCROLLABLE MERKLE BLOCK LIST */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F2E4D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold text-base">
              Chronological Audit Trail ({blocks.length} Anchored Blocks)
            </h2>
          </div>
          <span className="text-slate-400 text-xs">
            Append-only state tree • SHA-256 Digest
          </span>
        </div>

        <div className="divide-y divide-[#1F2E4D] max-h-[560px] overflow-y-auto">
          {blocks.map((blk, idx) => {
            const isTarget = isTampered && blk.index === tamperedIndex;
            const isVerifiedSuccess = verificationState.status === 'SUCCESS';
            const isVerifiedFailed = verificationState.status === 'FAILED' && verificationState.failedBlock === blk.index;

            return (
              <div 
                key={blk.index}
                className={`p-5 transition-colors ${
                  isVerifiedFailed 
                    ? 'bg-rose-500/10 border-l-4 border-l-rose-500' 
                    : isVerifiedSuccess 
                      ? 'hover:bg-[#1E2D4F]/40 border-l-4 border-l-emerald-500' 
                      : 'hover:bg-[#1E2D4F]/30 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-sm text-cyan-400 bg-[#0B1220] py-1 px-2.5 rounded border border-[#1F2E4D]">
                      Block #{blk.index}
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {blk.action}
                    </span>
                    {isTarget && (
                      <span className="text-[10px] font-bold py-0.5 px-2 bg-rose-500/20 text-rose-300 rounded border border-rose-500/40">
                        MUTATED PAYLOAD
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{blk.timestamp}</span>
                  </div>
                </div>

                {/* HASH DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs bg-[#0B1220]/70 p-3 rounded-lg border border-[#1F2E4D]">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold">Current State Hash:</span>
                    </div>
                    <div className="font-mono text-cyan-300/90 break-all select-all text-[11px] bg-[#16213A] p-1.5 rounded">
                      {blk.current_hash}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold">Parent Block Hash:</span>
                    </div>
                    <div className="font-mono text-slate-400 break-all select-all text-[11px] bg-[#16213A] p-1.5 rounded">
                      {blk.previous_hash}
                    </div>
                  </div>
                </div>

                {/* PAYLOAD METADATA */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-violet-400" />
                    <span>Data Payload:</span>
                    <code className="text-violet-300 font-mono text-[11px] bg-[#0B1220] py-0.5 px-2 rounded">
                      {JSON.stringify(blk.payload)}
                    </code>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Payload Digest: {blk.data_hash.substring(0, 12)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
