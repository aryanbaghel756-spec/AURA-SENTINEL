import React, { useState, useEffect, useRef } from "react";
import { audioService } from "../../services/audioService";

const VALID_PASSCODES = ["AURA-2026", "SIH2026", "2026", "AURA2026", "ADMIN"];

export default function OperatorPasscodeModal({ isOpen, onSuccess, onCancel }) {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode("");
      setErrorMsg("");
      setIsShaking(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim() || isVerifying) return;

    setIsVerifying(true);
    audioService.playCommand();

    setTimeout(() => {
      const cleanPass = passcode.trim().toUpperCase();
      if (VALID_PASSCODES.includes(cleanPass)) {
        audioService.playSuccess();
        setErrorMsg("");
        setIsVerifying(false);
        onSuccess();
      } else {
        audioService.playAlert();
        setAttempts((prev) => prev + 1);
        setIsShaking(true);
        setErrorMsg("ACCESS DENIED: INVALID MASTER SECURITY PASSCODE");
        setIsVerifying(false);
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 400);
  };

  return (
    <div className="passcode-modal-backdrop" onClick={onCancel}>
      <div
        className={`passcode-modal-content ${isShaking ? "shake-error" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="passcode-header">
          <div className="passcode-badge">
            <span className="badge-shield-icon">🛡️</span>
            <span>LEVEL-1 OPERATOR OVERRIDE PROTOCOL</span>
          </div>
          <button className="passcode-close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="passcode-body">
          <div className="passcode-title-wrap">
            <h2>OPERATOR AUTHORIZATION REQUIRED</h2>
            <p>
              Direct system access requires authorized enterprise security credentials. Enter the master override key to bypass biometric verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="passcode-form">
            <div className="passcode-input-wrapper">
              <span className="key-icon">🔑</span>
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                placeholder="ENTER MASTER SECURITY PASSCODE..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg("");
                }}
                className={`passcode-input ${errorMsg ? "has-error" : ""}`}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                className="toggle-pass-visibility"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Passcode" : "Show Passcode"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {errorMsg && (
              <div className="passcode-error-banner">
                <span>⚠️</span> {errorMsg} (ATTEMPT {attempts}/3)
              </div>
            )}

            <div className="passcode-hint-box">
              <span className="hint-label">DEFENSE CREDENTIAL SPECIFICATION:</span>
              <p>
                Authorized SIH Operator Master Keys: <code>AURA-2026</code> or <code>SIH2026</code>
              </p>
            </div>

            <div className="passcode-actions">
              <button type="button" className="passcode-btn-cancel" onClick={onCancel}>
                ABORT ACCESS
              </button>
              <button
                type="submit"
                className="passcode-btn-submit"
                disabled={!passcode.trim() || isVerifying}
              >
                <span>⚡</span>
                {isVerifying ? "VERIFYING CREDENTIALS..." : "VERIFY & INITIALIZE WORKSTATION"}
              </button>
            </div>
          </form>
        </div>

        <div className="passcode-footer-telemetry">
          <span>SECURE KERNEL GATEWAY</span>
          <span>SHA256 CREDENTIAL VERIFICATION</span>
          <span>SIH26105</span>
        </div>
      </div>
    </div>
  );
}
