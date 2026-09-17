import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function BlockchainLedger() {
  const [ledgerData, setLedgerData] = useState(null);
  const [ledgerError, setLedgerError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showMineModal, setShowMineModal] = useState(false);
  const [mineForm, setMineForm] = useState({
    event_type: "RISK_AUDIT",
    asset_id: "SRV-PROD-DELHI-09",
    risk_score: "68",
    annual_loss_inr: "1250000",
    notes: "Automated perimeter scan identified exposed Redis port 6379.",
  });

  const showNotification = (text, type = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchLedger = async () => {
    try {
      const data = await api.getBlockchainLedger();
      setLedgerData(data);
      setLedgerError("");
    } catch {
      setLedgerError("BLOCKCHAIN CONSENSUS SERVICE UNAVAILABLE");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
    const interval = setInterval(fetchLedger, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyChain = async () => {
    setActionLoading(true);
    try {
      const res = await api.verifyBlockchain();
      setVerificationResult(res);
      if (res.is_valid) {
        showNotification("✓ Cryptographic Audit Passed: All SHA-256 Merkle blocks 100% authentic.", "success");
      } else {
        showNotification(`⚠ CRITICAL: Integrity breach detected at Block #${res.tampered_block}!`, "error");
      }
      await fetchLedger();
    } catch {
      showNotification("Integrity verification call failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    setActionLoading(true);
    try {
      const res = await api.simulateBlockchainTamper(1);
      setVerificationResult(res.integrity);
      showNotification(
        "⚡ Tamper Attack Injected: Insider modified historical loss in Block #1 without PoW consensus!",
        "warning"
      );
      await fetchLedger();
    } catch {
      showNotification("Tamper simulation call failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreConsensus = async () => {
    setActionLoading(true);
    try {
      const res = await api.restoreBlockchainConsensus();
      setVerificationResult(res.integrity);
      showNotification("✓ Decentralized Consensus Restored from trusted authority snapshot!", "success");
      await fetchLedger();
    } catch {
      showNotification("Restore consensus call failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMineBlock = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        event_type: mineForm.event_type,
        data: {
          asset_id: mineForm.asset_id,
          risk_score: Number(mineForm.risk_score),
          estimated_annual_loss_inr: Number(mineForm.annual_loss_inr),
          notes: mineForm.notes,
          timestamp_ist: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        },
      };
      await api.mineBlockchainBlock(payload);
      setShowMineModal(false);
      showNotification(`✓ Block mined & appended to chain with SHA-256 Proof-of-Work!`, "success");
      await fetchLedger();
    } catch {
      showNotification("Failed to mine block.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    showNotification("Hash copied to clipboard!", "info");
  };

  const isChainValid =
    verificationResult !== null
      ? verificationResult.is_valid
      : ledgerData?.is_chain_valid ?? true;

  return (
    <main className="blockchain-dashboard">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`blockchain-toast blockchain-toast-${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      {/* Header Section */}
      <div className="blockchain-title-section">
        <div>
          <p className="module-page-eyebrow">
            SIH26105 / THEME: BLOCKCHAIN & CYBERSECURITY / AICTE CYBER CELL
          </p>
          <h1>BLOCKCHAIN AUDIT LEDGER</h1>
          <p className="blockchain-description">
            Continuous cryptographic audit trail utilizing SHA-256 blocks, Merkle root verification,
            and Proof-of-Work. Prevents insider tampering of cyber risk quantification, ROSI ROI
            calculations, and incident containment records.
          </p>
        </div>

        <div className="blockchain-live-badge">
          <span
            className="pulse-indicator"
            style={{
              backgroundColor: isChainValid ? "#00ff88" : "#ff3366",
              boxShadow: isChainValid
                ? "0 0 10px #00ff88"
                : "0 0 14px #ff3366",
            }}
          ></span>
          <span>
            {isChainValid
              ? "LEDGER INTEGRITY: SECURE (100% CONSENSUS)"
              : "INTEGRITY BREACH DETECTED"}
          </span>
        </div>
      </div>

      {ledgerError ? (
        <div className="connection-error">{ledgerError}</div>
      ) : isLoading || !ledgerData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          LOADING CRYPTOGRAPHIC LEDGER & VERIFYING MERKLE ROOTS...
        </div>
      ) : (
        <>
          {/* Real-time Status Alert Banner */}
          {!isChainValid && (
            <div className="blockchain-tamper-alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-text">
                <strong>CRITICAL AUDIT BREACH DETECTED:</strong>
                <p>
                  {verificationResult?.message ||
                    "Block data has been modified without re-computing valid Proof-of-Work! Insider alteration flagged immediately."}
                </p>
                {verificationResult?.tampered_block !== null && (
                  <span className="tamper-tag">
                    CORRUPTED NODE: BLOCK #{verificationResult.tampered_block}
                  </span>
                )}
              </div>
              <button
                className="action-btn restore-btn"
                onClick={handleRestoreConsensus}
                disabled={actionLoading}
              >
                🔄 RESTORE CONSENSUS
              </button>
            </div>
          )}

          {/* Top KPI Metrics Grid */}
          <section className="blockchain-kpi-grid">
            <div className="blockchain-kpi-card">
              <span className="kpi-label">TOTAL SEALED BLOCKS</span>
              <strong className="kpi-value">{ledgerData.total_blocks}</strong>
              <small>From Genesis Node to tip</small>
            </div>

            <div className="blockchain-kpi-card">
              <span className="kpi-label">CHAIN INTEGRITY</span>
              <strong
                className="kpi-value"
                style={{ color: isChainValid ? "#00ff88" : "#ff3366" }}
              >
                {isChainValid ? "VERIFIED" : "TAMPERED"}
              </strong>
              <small>SHA-256 + Merkle Tree Check</small>
            </div>

            <div className="blockchain-kpi-card">
              <span className="kpi-label">CONSENSUS CONSORTIUM</span>
              <strong className="kpi-value">3 NODES</strong>
              <small>AICTE HQ • IIT-D • NIT-K</small>
            </div>

            <div className="blockchain-kpi-card">
              <span className="kpi-label">COMPLIANCE FRAMEWORK</span>
              <strong className="kpi-value">NIST CSF 2.0</strong>
              <small>FAIR Risk Model v2.1 Ready</small>
            </div>
          </section>

          {/* Evaluator Interactive Demo Action Console */}
          <section className="blockchain-controls-card">
            <div className="controls-header">
              <div>
                <span className="process-eyebrow">HACKATHON EVALUATOR CONSOLE</span>
                <h3>LIVE CRYPTOGRAPHIC DEMO CONTROLS</h3>
                <p>
                  Test tamper-detection algorithms and witness real-time cryptographic defense in
                  action.
                </p>
              </div>

              <div className="controls-actions">
                <button
                  className="action-btn verify-btn"
                  onClick={handleVerifyChain}
                  disabled={actionLoading}
                  title="Recalculates all Merkle trees and previous hash pointers"
                >
                  🛡️ RUN INTEGRITY AUDIT
                </button>

                <button
                  className="action-btn tamper-btn"
                  onClick={handleSimulateTamper}
                  disabled={actionLoading}
                  title="Illegally modifies historical financial risk inside Block #1"
                >
                  ⚠️ SIMULATE TAMPER ATTACK
                </button>

                <button
                  className="action-btn restore-btn"
                  onClick={handleRestoreConsensus}
                  disabled={actionLoading}
                  title="Restores chain from verified decentralized state"
                >
                  🔄 RESTORE CONSENSUS
                </button>

                <button
                  className="action-btn mine-btn"
                  onClick={() => setShowMineModal(true)}
                  disabled={actionLoading}
                >
                  ⛏️ MINE AUDIT BLOCK
                </button>
              </div>
            </div>
          </section>

          {/* Decentralized Validator Nodes Status */}
          <section className="blockchain-nodes-section">
            <div className="nodes-header">
              <span className="process-eyebrow">DECENTRALIZED CONSENSUS MESH</span>
              <h3>ACTIVE RISK VALIDATION NODES</h3>
            </div>
            <div className="nodes-grid">
              {(ledgerData.consensus_nodes || []).map((node, i) => (
                <div key={i} className="node-card">
                  <div className="node-header">
                    <span className="node-indicator"></span>
                    <span className="node-title">{node.node}</span>
                  </div>
                  <div className="node-details">
                    <span className="node-badge">{node.status}</span>
                    <span className="node-sync">✓ SYNCED (BLOCK #{ledgerData.total_blocks - 1})</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Block Explorer Feed */}
          <section className="blockchain-explorer-section">
            <div className="explorer-header">
              <div>
                <span className="process-eyebrow">IMMUTABLE TIME-CHAIN EXPLORER</span>
                <h3>CRYPTOGRAPHIC RISK AUDIT LEDGER</h3>
              </div>
              <div className="explorer-meta">
                LATEST BLOCK HASH:{" "}
                <code
                  className="clickable-hash"
                  onClick={() => copyToClipboard(ledgerData.latest_block?.hash || "")}
                  title="Click to copy hash"
                >
                  {(ledgerData.latest_block?.hash || "").slice(0, 16)}...
                </code>
              </div>
            </div>

            <div className="blocks-timeline">
              {(ledgerData.chain || []).map((block) => {
                const isGenesis = block.index === 0;
                const isCorrupted =
                  verificationResult &&
                  !verificationResult.is_valid &&
                  verificationResult.tampered_block === block.index;

                const eventBadgeColors = {
                  GENESIS_ANCHOR: { bg: "rgba(0, 240, 255, 0.15)", text: "#00f0ff", border: "#00f0ff" },
                  RISK_QUANTIFICATION: { bg: "rgba(255, 204, 0, 0.15)", text: "#ffcc00", border: "#ffcc00" },
                  INVESTMENT_OPTIMIZATION: { bg: "rgba(0, 255, 136, 0.15)", text: "#00ff88", border: "#00ff88" },
                  THREAT_QUARANTINE: { bg: "rgba(180, 77, 255, 0.15)", text: "#b44dff", border: "#b44dff" },
                  RISK_AUDIT: { bg: "rgba(255, 120, 0, 0.15)", text: "#ff7800", border: "#ff7800" },
                };

                const badge = eventBadgeColors[block.event_type] || {
                  bg: "rgba(255,255,255,0.1)",
                  text: "#ffffff",
                  border: "#666",
                };

                return (
                  <div
                    key={block.index}
                    className={`block-card ${isCorrupted ? "block-card-tampered" : ""}`}
                  >
                    <div className="block-card-header">
                      <div className="block-title-group">
                        <span className="block-index">BLOCK #{block.index}</span>
                        <span
                          className="block-event-badge"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {block.event_type}
                        </span>
                        {isCorrupted && (
                          <span className="block-tamper-pill">
                            ⚠ TAMPER ATTACK DETECTED
                          </span>
                        )}
                      </div>
                      <span className="block-timestamp">
                        {new Date(block.timestamp).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}
                      </span>
                    </div>

                    <div className="block-hashes-grid">
                      <div className="hash-item">
                        <span className="hash-label">BLOCK HASH (SHA-256)</span>
                        <code
                          className="hash-value"
                          onClick={() => copyToClipboard(block.hash)}
                          title="Click to copy SHA-256"
                        >
                          {block.hash}
                        </code>
                      </div>

                      <div className="hash-item">
                        <span className="hash-label">PREVIOUS BLOCK HASH</span>
                        <code className="hash-value">
                          {isGenesis ? "0000000000000000000000000000000000000000000000000000000000000000 (GENESIS)" : block.previous_hash}
                        </code>
                      </div>

                      <div className="hash-item">
                        <span className="hash-label">MERKLE ROOT HASH</span>
                        <code className="hash-value">{block.merkle_root}</code>
                      </div>

                      <div className="hash-item">
                        <span className="hash-label">PROOF-OF-WORK NONCE</span>
                        <span className="nonce-badge">Nonce: {block.nonce}</span>
                      </div>
                    </div>

                    {/* Block Payload Data */}
                    <div className="block-payload">
                      <span className="payload-label">AUDIT TRANSACTION PAYLOAD</span>
                      <pre className="payload-content">
                        {JSON.stringify(block.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Modal: Mine Custom Audit Block */}
          {showMineModal && (
            <div className="blockchain-modal-overlay" onClick={() => setShowMineModal(false)}>
              <div
                className="blockchain-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>⛏️ MINE NEW AUDIT BLOCK</h3>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowMineModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleMineBlock} className="mine-form">
                  <div className="form-group">
                    <label>EVENT TYPE</label>
                    <select
                      value={mineForm.event_type}
                      onChange={(e) =>
                        setMineForm({ ...mineForm, event_type: e.target.value })
                      }
                    >
                      <option value="RISK_AUDIT">RISK_AUDIT</option>
                      <option value="RISK_QUANTIFICATION">RISK_QUANTIFICATION</option>
                      <option value="INVESTMENT_OPTIMIZATION">INVESTMENT_OPTIMIZATION</option>
                      <option value="THREAT_QUARANTINE">THREAT_QUARANTINE</option>
                      <option value="COMPLIANCE_CHECK">COMPLIANCE_CHECK</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>TARGET ASSET / NODE ID</label>
                    <input
                      type="text"
                      value={mineForm.asset_id}
                      onChange={(e) =>
                        setMineForm({ ...mineForm, asset_id: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>RISK SCORE (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={mineForm.risk_score}
                        onChange={(e) =>
                          setMineForm({ ...mineForm, risk_score: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>ESTIMATED LOSS (₹ INR)</label>
                      <input
                        type="number"
                        min="0"
                        value={mineForm.annual_loss_inr}
                        onChange={(e) =>
                          setMineForm({ ...mineForm, annual_loss_inr: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>AUDIT NOTES / VULNERABILITY CONTEXT</label>
                    <textarea
                      rows="3"
                      value={mineForm.notes}
                      onChange={(e) =>
                        setMineForm({ ...mineForm, notes: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="action-btn cancel-btn"
                      onClick={() => setShowMineModal(false)}
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="action-btn confirm-mine-btn"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "MINING BLOCK..." : "MINE & SEAL BLOCK"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
