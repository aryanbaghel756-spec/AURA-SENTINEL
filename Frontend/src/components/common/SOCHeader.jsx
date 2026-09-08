import React, { useState, useEffect } from "react";
import { MODULE_REGISTRY } from "../../constants/modules";
import { audioService } from "../../services/audioService";

export default function SOCHeader({
  activeModule,
  onSelectModule,
  onBackToDashboard,
  onOpenPalette,
  onGenerateReport,
  currentUser = null,
  onLogout = null,
  backendConnected = true,
  alertCount = 0,
}) {
  const [currentTime, setCurrentTime] = useState("");
  const [showUtc, setShowUtc] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (showUtc) {
        setCurrentTime(now.toUTCString().slice(17, 25) + " UTC");
      } else {
        setCurrentTime(
          now.toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " IST"
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [showUtc]);

  const toggleSound = () => {
    const newState = audioService.toggleSound();
    setSoundEnabled(newState);
    if (newState) audioService.playActivation();
  };

  const currentMod = MODULE_REGISTRY.find((m) => m.id === activeModule);

  return (
    <header className="soc-topbar">
      <div className="soc-topbar-left">
        {activeModule && (
          <button
            className="soc-back-btn"
            onClick={() => {
              audioService.playClick();
              onBackToDashboard();
            }}
          >
            ← COMMAND CENTER
          </button>
        )}

        <div
          className="soc-brand"
          onClick={() => {
            audioService.playClick();
            onBackToDashboard();
          }}
        >
          <span className="soc-brand-dot"></span>
          <div className="soc-brand-text">
            <span className="soc-brand-title">AURA</span>
            <span className="soc-brand-sub">SENTINEL</span>
          </div>
        </div>

        {activeModule && currentMod && (
          <div className="soc-module-switcher">
            <button
              className="soc-switcher-trigger"
              onClick={() => {
                audioService.playClick();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <span className="switcher-num">{currentMod.number}</span>
              <span className="switcher-icon">{currentMod.icon}</span>
              <span className="switcher-name">{currentMod.name}</span>
              <span className="switcher-arrow">{dropdownOpen ? "▲" : "▼"}</span>
            </button>

            {dropdownOpen && (
              <div className="soc-switcher-menu">
                {MODULE_REGISTRY.map((mod) => (
                  <button
                    key={mod.id}
                    className={`soc-switcher-item ${mod.id === activeModule ? "active" : ""}`}
                    onClick={() => {
                      audioService.playCommand();
                      onSelectModule(mod.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="item-num">{mod.number}</span>
                    <span className="item-icon">{mod.icon}</span>
                    <span className="item-name">{mod.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="soc-topbar-right">
        {/* Command Palette Button */}
        <button
          className="soc-time-display"
          onClick={() => {
            audioService.playClick();
            if (onOpenPalette) onOpenPalette();
          }}
          title="Open Command Palette (Ctrl+K)"
        >
          <span className="time-clock-icon">⌘</span>
          <span>CTRL+K</span>
        </button>

        {/* Executive PDF Audit Report Button */}
        {onGenerateReport && (
          <button
            className="soc-time-display audit-btn"
            onClick={() => {
              audioService.playCommand();
              onGenerateReport();
            }}
            title="Generate & Print Executive Security Audit Report"
          >
            <span>📄 AUDIT REPORT</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          className={`soc-time-display ${soundEnabled ? "active" : ""}`}
          onClick={toggleSound}
          title={soundEnabled ? "Cyber Audio: Engaged (Click to Mute)" : "Cyber Audio: Muted (Click to Enable)"}
        >
          <span>{soundEnabled ? "🔊 AUDIO ON" : "🔇 AUDIO MUTED"}</span>
        </button>

        {/* Live Clock */}
        <button
          className="soc-time-display"
          onClick={() => setShowUtc(!showUtc)}
          title="Click to toggle UTC / IST"
        >
          <span className="time-clock-icon">⏱</span>
          <span>{currentTime}</span>
        </button>

        {/* Alert Ticker Indicator */}
        {alertCount > 0 && (
          <div className="soc-connection-pill alert" title="Active Security Alerts">
            <span className="pulse-indicator" style={{ background: "var(--threat-high)" }}></span>
            <span>{alertCount} ALERTS</span>
          </div>
        )}

        {/* Operator Identity Badge */}
        {currentUser && (
          <div className="soc-operator-badge" title={`Role: ${currentUser.role} • Logged in as ${currentUser.username}`}>
            <span className="operator-icon">👤</span>
            <span className="operator-name">{currentUser.full_name || currentUser.username}</span>
            <span className="operator-role-tag">
              {currentUser.role?.includes("Level 1") ? "LEVEL 1" : currentUser.role?.includes("Level 2") ? "LEVEL 2" : "LEVEL 3"}
            </span>
            {onLogout && (
              <button
                className="operator-logout-btn"
                onClick={() => {
                  audioService.playClick();
                  onLogout();
                }}
                title="Lock workstation and logout operator"
              >
                ⏻
              </button>
            )}
          </div>
        )}

        <div className={`soc-connection-pill ${backendConnected ? "online" : "offline"}`}>
          <span className="pulse-indicator"></span>
          <span>{backendConnected ? "SYSTEM ONLINE" : "BACKEND OFFLINE"}</span>
        </div>
      </div>
    </header>
  );
}
