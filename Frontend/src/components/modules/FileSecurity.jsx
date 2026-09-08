import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import ConfirmModal from "../common/ConfirmModal";

export default function FileSecurity() {
  const [filesecView, setFilesecView] = useState("scan"); // scan | quarantine
  const [fileSecurityData, setFileSecurityData] = useState(null);
  const [fileSecurityError, setFileSecurityError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [quarantineList, setQuarantineList] = useState(null);
  const [quarantineError, setQuarantineError] = useState("");
  const [selectedQuarantine, setSelectedQuarantine] = useState([]);

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    isDestructive: false,
    onConfirm: () => {},
  });

  const fetchScan = async () => {
    try {
      setIsScanning(true);
      setFileSecurityError("");
      const data = await api.scanFiles();
      setFileSecurityData(data);
      setSelectedFiles([]);
    } catch {
      setFileSecurityError("FILE INTEGRITY SCAN UNAVAILABLE");
    } finally {
      setIsScanning(false);
    }
  };

  const fetchQuarantine = async () => {
    try {
      setQuarantineError("");
      const data = await api.listQuarantine();
      setQuarantineList(data);
      setSelectedQuarantine([]);
    } catch {
      setQuarantineError("QUARANTINE VAULT UNAVAILABLE");
    }
  };

  useEffect(() => {
    if (filesecView === "scan") fetchScan();
    else fetchQuarantine();
  }, [filesecView]);

  const toggleFile = (path) => {
    setSelectedFiles((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const toggleQuarantineItem = (name) => {
    setSelectedQuarantine((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const filteredFiles = fileSecurityData
    ? fileSecurityData.files.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.source_folder.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const allFilteredSelected =
    filteredFiles.length > 0 && filteredFiles.every((f) => selectedFiles.includes(f.path));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedFiles((prev) => prev.filter((p) => !filteredFiles.some((f) => f.path === p)));
    } else {
      setSelectedFiles((prev) => [
        ...prev,
        ...filteredFiles.filter((f) => !prev.includes(f.path)).map((f) => f.path),
      ]);
    }
  };

  // Safe Quarantine Handler via ConfirmModal
  const triggerQuarantine = () => {
    if (selectedFiles.length === 0) return;

    setConfirmConfig({
      isOpen: true,
      title: "QUARANTINE ENFORCEMENT",
      message: `Move ${selectedFiles.length} file(s) to the secure AURA Quarantine vault? Files will be relocated safely and can be restored at any time.`,
      confirmText: "MOVE TO QUARANTINE",
      isDestructive: false,
      onConfirm: async () => {
        setConfirmConfig((c) => ({ ...c, isOpen: false }));
        try {
          setIsActionLoading(true);
          const res = await api.quarantineFiles(selectedFiles);
          const count = res.results.filter((r) => r.status === "QUARANTINED").length;
          setActionMessage(`SUCCESS: ${count} file(s) relocated to Quarantine vault.`);
          fetchScan();
        } catch {
          setActionMessage("QUARANTINE ACTION FAILED");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  // Safe Delete (Recycle Bin) Handler via ConfirmModal
  const triggerDelete = () => {
    if (selectedFiles.length === 0) return;

    setConfirmConfig({
      isOpen: true,
      title: "RECYCLE BIN RELOCATION",
      message: `Move ${selectedFiles.length} file(s) to the Windows Recycle Bin? They will be removed from working directories but remain recoverable.`,
      confirmText: "MOVE TO RECYCLE BIN",
      isDestructive: true,
      onConfirm: async () => {
        setConfirmConfig((c) => ({ ...c, isOpen: false }));
        try {
          setIsActionLoading(true);
          const res = await api.deleteFilesRecycleBin(selectedFiles);
          const count = res.results.filter((r) => r.status === "DELETED").length;
          setActionMessage(`SUCCESS: ${count} file(s) moved to Windows Recycle Bin.`);
          fetchScan();
        } catch {
          setActionMessage("DELETE ACTION FAILED");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  // Safe Restore Handler via ConfirmModal
  const triggerRestore = () => {
    if (selectedQuarantine.length === 0) return;

    setConfirmConfig({
      isOpen: true,
      title: "QUARANTINE RESTORATION",
      message: `Restore ${selectedQuarantine.length} quarantined item(s) back to their original disk locations?`,
      confirmText: "RESTORE FILES",
      isDestructive: false,
      onConfirm: async () => {
        setConfirmConfig((c) => ({ ...c, isOpen: false }));
        try {
          setIsActionLoading(true);
          const res = await api.restoreQuarantine(selectedQuarantine);
          const count = res.results.filter((r) => r.status === "RESTORED").length;
          setActionMessage(`SUCCESS: ${count} file(s) restored to original paths.`);
          fetchQuarantine();
        } catch {
          setActionMessage("RESTORE ACTION FAILED");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const categoryBreakdown = fileSecurityData
    ? fileSecurityData.files.reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <main className="filesec-dashboard">
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
      />

      <div className="filesec-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / FILE INTEGRITY ENGINE</p>
          <h1>FILE SECURITY</h1>
          <p className="filesec-description">
            Scans Downloads, Desktop, and Documents for plain-text credentials, duplicate hashes, and temporary bloat. All operations require explicit user approval.
          </p>
        </div>

        <div className="filesec-header-actions">
          <div className="filesec-tabs">
            <button
              className={`filesec-tab ${filesecView === "scan" ? "active" : ""}`}
              onClick={() => setFilesecView("scan")}
            >
              DIRECTORY SCAN
            </button>
            <button
              className={`filesec-tab ${filesecView === "quarantine" ? "active" : ""}`}
              onClick={() => setFilesecView("quarantine")}
            >
              QUARANTINE VAULT
            </button>
          </div>

          {filesecView === "scan" && (
            <button
              className="filesec-rescan-btn"
              onClick={fetchScan}
              disabled={isScanning}
            >
              {isScanning ? "SCANNING..." : "⟳ RESCAN DIRECTORIES"}
            </button>
          )}
        </div>
      </div>

      {actionMessage && <div className="filesec-message-toast">{actionMessage}</div>}

      {filesecView === "scan" ? (
        fileSecurityError ? (
          <div className="connection-error">{fileSecurityError}</div>
        ) : !fileSecurityData ? (
          <div className="loading-system">
            <div className="module-loader"></div>
            INSPECTING LOCAL DIRECTORIES FOR EXPOSURES...
          </div>
        ) : (
          <>
            <section className="filesec-summary-grid">
              <div className="filesec-summary-card">
                <span className="summary-label">FILES SCANNED</span>
                <strong className="summary-val">{fileSecurityData.total_files_scanned}</strong>
                <small>Downloads, Desktop, Documents</small>
              </div>

              <div className="filesec-summary-card">
                <span className="summary-label">FLAGGED ANOMALIES</span>
                <strong className="summary-val accent">{fileSecurityData.total_flagged}</strong>
                <small>Requiring analyst inspection</small>
              </div>

              <div className="filesec-summary-card">
                <span className="summary-label">RECOVERABLE SPACE</span>
                <strong className="summary-val">{fileSecurityData.potential_space_recoverable_mb} MB</strong>
                <small>Junk & duplicate deduplication</small>
              </div>
            </section>

            {fileSecurityData.total_flagged > 0 && (
              <section className="filesec-breakdown">
                <h2>ANOMALY CATEGORY DISTRIBUTION</h2>
                <div className="filesec-breakdown-bars">
                  {Object.entries(categoryBreakdown).map(([category, count]) => (
                    <div className="filesec-breakdown-row" key={category}>
                      <span className={`filesec-tag ${category.toLowerCase()}`}>{category}</span>
                      <div className="filesec-breakdown-track">
                        <div
                          className={`filesec-breakdown-fill ${category.toLowerCase()}`}
                          style={{
                            width: `${(count / fileSecurityData.total_flagged) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <strong className="count-label">{count}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="filesec-list-section">
              <div className="filesec-list-header">
                <div>
                  <span className="process-eyebrow">AUDIT RESULTS</span>
                  <h2>FLAGGED FILES</h2>
                </div>

                <div className="filesec-list-controls">
                  <input
                    type="text"
                    className="soc-search-input"
                    placeholder="Search file name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <button
                    className="filesec-select-all-btn"
                    onClick={toggleSelectAll}
                    disabled={filteredFiles.length === 0}
                  >
                    {allFilteredSelected ? "DESELECT ALL" : "SELECT ALL"}
                  </button>

                  <button
                    className="filesec-quarantine-btn"
                    disabled={selectedFiles.length === 0 || isActionLoading}
                    onClick={triggerQuarantine}
                  >
                    {isActionLoading ? "PROCESSING..." : `QUARANTINE (${selectedFiles.length})`}
                  </button>

                  <button
                    className="filesec-delete-btn"
                    disabled={selectedFiles.length === 0 || isActionLoading}
                    onClick={triggerDelete}
                  >
                    DELETE ({selectedFiles.length})
                  </button>
                </div>
              </div>

              {filteredFiles.length === 0 ? (
                <div className="no-ports">
                  {searchQuery ? "NO FLAGGED FILES MATCH FILTER" : "NO THREATS FLAGGED — DIRECTORIES NOMINAL"}
                </div>
              ) : (
                <div className="filesec-file-list">
                  {filteredFiles.map((file) => (
                    <div className="filesec-file-row" key={file.path}>
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.path)}
                        onChange={() => toggleFile(file.path)}
                      />
                      <span className={`filesec-tag ${file.category.toLowerCase()}`}>
                        {file.category}
                      </span>
                      <div className="filesec-file-info">
                        <strong>{file.name}</strong>
                        <small>
                          {file.source_folder} · {(file.size / 1024).toFixed(1)} KB · {file.path}
                        </small>
                        <p>{file.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )
      ) : quarantineError ? (
        <div className="connection-error">{quarantineError}</div>
      ) : !quarantineList ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          LOADING QUARANTINE VAULT...
        </div>
      ) : (
        <section className="filesec-list-section">
          <div className="filesec-list-header">
            <div>
              <span className="process-eyebrow">ISOLATED THREATS</span>
              <h2>QUARANTINED FILES ({quarantineList.total_quarantined})</h2>
            </div>

            <button
              className="filesec-restore-btn"
              disabled={selectedQuarantine.length === 0 || isActionLoading}
              onClick={triggerRestore}
            >
              {isActionLoading ? "RESTORING..." : `RESTORE SELECTED (${selectedQuarantine.length})`}
            </button>
          </div>

          {quarantineList.items.length === 0 ? (
            <div className="no-ports">QUARANTINE VAULT IS EMPTY</div>
          ) : (
            <div className="filesec-file-list">
              {quarantineList.items.map((item) => (
                <div className="filesec-file-row" key={item.quarantine_name}>
                  <input
                    type="checkbox"
                    checked={selectedQuarantine.includes(item.quarantine_name)}
                    onChange={() => toggleQuarantineItem(item.quarantine_name)}
                  />
                  <span className="filesec-tag quarantined">QUARANTINED</span>
                  <div className="filesec-file-info">
                    <strong>{item.original_path.split(/[\\/]/).pop()}</strong>
                    <small>
                      {(item.size / 1024).toFixed(1)} KB · from {item.original_path}
                    </small>
                    <p>Quarantined: {new Date(item.quarantined_at * 1000).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
