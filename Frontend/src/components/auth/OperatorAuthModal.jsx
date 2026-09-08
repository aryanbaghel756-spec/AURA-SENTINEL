import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";

export default function OperatorAuthModal({ isOpen, onSuccess, onCancel }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Level 1 - SOC Operator");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setIsShaking(false);
      setTimeout(() => {
        if (usernameInputRef.current) usernameInputRef.current.focus();
      }, 120);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleQuickAdmin = () => {
    audioService.playCommand();
    setUsername("admin");
    setPassword("aura2026");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please provide both username and password.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    audioService.playCommand();

    try {
      if (activeTab === "login") {
        const res = await api.loginOperator({ username, password });
        if (res.status === "SUCCESS" && res.user) {
          audioService.playSuccess();
          localStorage.setItem("aura_current_user", JSON.stringify(res.user));
          onSuccess(res.user);
        } else {
          audioService.playAlert();
          setErrorMsg(res.message || "Invalid operator credentials.");
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      } else {
        // Registration
        const res = await api.registerOperator({
          username,
          full_name: fullName || username,
          password,
          role,
        });
        if (res.status === "SUCCESS" && res.user) {
          audioService.playSuccess();
          localStorage.setItem("aura_current_user", JSON.stringify(res.user));
          onSuccess(res.user);
        } else {
          audioService.playAlert();
          setErrorMsg(res.message || "Operator registration failed.");
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
        }
      }
    } catch (err) {
      audioService.playAlert();
      setErrorMsg(err.message || "Network exception during authentication.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="passcode-modal-backdrop" onClick={onCancel}>
      <div
        className={`passcode-modal-content operator-auth-modal ${isShaking ? "shake-error" : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <div className="passcode-header">
          <div className="passcode-badge">
            <span className="badge-shield-icon">🛡️</span>
            <span>AURA SENTINEL IDENTITY & ACCESS MANAGEMENT</span>
          </div>
          <button className="passcode-close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              audioService.playClick();
              setActiveTab("login");
              setErrorMsg("");
            }}
          >
            🔑 OPERATOR LOGIN
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => {
              audioService.playClick();
              setActiveTab("register");
              setErrorMsg("");
            }}
          >
            📝 REGISTER NEW OPERATOR
          </button>
        </div>

        <div className="passcode-body" style={{ paddingTop: "12px" }}>
          <div className="passcode-title-wrap">
            <h2>{activeTab === "login" ? "OPERATOR CLEARANCE LOGIN" : "ENROLL NEW SOC OPERATOR"}</h2>
            <p>
              {activeTab === "login"
                ? "Authenticate your enterprise credentials to access active cybersecurity controls and telemetry."
                : "Create a registered profile stored persistently in the AURA Sentinel SQLite database."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="passcode-form">
            {activeTab === "register" && (
              <div className="passcode-input-wrapper" style={{ marginBottom: "12px" }}>
                <span className="key-icon">👤</span>
                <input
                  type="text"
                  placeholder="OPERATOR FULL NAME (e.g. Aryan Sharma)..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="passcode-input"
                  autoComplete="off"
                />
              </div>
            )}

            <div className="passcode-input-wrapper" style={{ marginBottom: "12px" }}>
              <span className="key-icon">🆔</span>
              <input
                ref={usernameInputRef}
                type="text"
                placeholder="OPERATOR USERNAME (e.g. aryan)..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg("");
                }}
                className={`passcode-input ${errorMsg ? "has-error" : ""}`}
                autoComplete="username"
                spellCheck="false"
              />
            </div>

            <div className="passcode-input-wrapper" style={{ marginBottom: "12px" }}>
              <span className="key-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="SECURITY PASSWORD..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                className={`passcode-input ${errorMsg ? "has-error" : ""}`}
                autoComplete="current-password"
                spellCheck="false"
              />
              <button
                type="button"
                className="toggle-pass-visibility"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {activeTab === "register" && (
              <div className="role-selector-wrap" style={{ marginBottom: "14px" }}>
                <label className="auth-input-label">SECURITY CLEARANCE LEVEL & ROLE:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-dropdown-select"
                >
                  <option value="Level 1 - SOC Operator">Level 1 - SOC Operator (Frontline Control & Containment)</option>
                  <option value="Level 2 - Incident Responder">Level 2 - Incident Responder (Deep Forensics & Malware)</option>
                  <option value="Level 3 - Security Architect">Level 3 - Security Architect (Threat Modeling & Policy)</option>
                </select>
              </div>
            )}

            {errorMsg && (
              <div className="passcode-error-banner" style={{ marginBottom: "12px" }}>
                <span>⚠️</span> {errorMsg}
              </div>
            )}

            {activeTab === "login" && (
              <div className="passcode-hint-box" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="hint-label">DEFAULT ADMIN CREDENTIALS:</span>
                  <button
                    type="button"
                    onClick={handleQuickAdmin}
                    className="quick-fill-btn"
                  >
                    ⚡ Auto-Fill Admin
                  </button>
                </div>
                <p style={{ marginTop: "4px" }}>
                  Username: <code>admin</code> | Password: <code>aura2026</code> (Level 1 Clearance)
                </p>
              </div>
            )}

            <div className="passcode-actions">
              <button type="button" className="passcode-btn-cancel" onClick={onCancel}>
                CANCEL
              </button>
              <button
                type="submit"
                className="passcode-btn-submit"
                disabled={!username.trim() || !password.trim() || isSubmitting}
              >
                <span>⚡</span>
                {isSubmitting
                  ? "AUTHENTICATING..."
                  : activeTab === "login"
                  ? "AUTHORIZE & INITIALIZE WORKSTATION"
                  : "REGISTER & ENROLL OPERATOR"}
              </button>
            </div>
          </form>
        </div>

        <div className="passcode-footer-telemetry">
          <span>SQLITE3 USER VAULT</span>
          <span>SALTED SHA-256 HASH</span>
          <span>ZERO-TRUST IDENTITY</span>
        </div>
      </div>
    </div>
  );
}
