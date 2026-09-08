import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import "./App.css";
import { api } from "./services/api";
import { audioService } from "./services/audioService";
import { generateSecurityAuditReport } from "./services/reportGenerator";

// Common Components
import SOCHeader from "./components/common/SOCHeader";
import CommandPalette from "./components/common/CommandPalette";
import NotificationToast from "./components/common/NotificationToast";
import AuditReportModal from "./components/common/AuditReportModal";

// Landing Page Components
import LandingHero from "./components/landing/LandingHero";
import PulseStrip from "./components/landing/PulseStrip";
import PipelineSection from "./components/landing/PipelineSection";
import ShowcaseSection from "./components/landing/ShowcaseSection";
import LandingFooter from "./components/landing/LandingFooter";

// Auth & Boot Components
import FaceAuthModal from "./components/auth/FaceAuthModal";
import OperatorPasscodeModal from "./components/auth/OperatorPasscodeModal";
import OperatorAuthModal from "./components/auth/OperatorAuthModal";
import BootScreen from "./components/auth/BootScreen";

// Dashboard
import CommandCenter from "./components/dashboard/CommandCenter";

// 9 Intelligence Modules
import SystemMonitoring from "./components/modules/SystemMonitoring";
import AttackSurface from "./components/modules/AttackSurface";
import RiskIntelligence from "./components/modules/RiskIntelligence";
import FinancialRisk from "./components/modules/FinancialRisk";
import WhatIfEngine from "./components/modules/WhatIfEngine";
import InvestmentOptimizer from "./components/modules/InvestmentOptimizer";
import AIAssistant from "./components/modules/AIAssistant";
import FileSecurity from "./components/modules/FileSecurity";
import VisionIntelligence from "./components/modules/VisionIntelligence";

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [systemStarted, setSystemStarted] = useState(false);
  const [booting, setBooting] = useState(false);
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showOperatorAuthModal, setShowOperatorAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("aura_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [faceModelsLoaded, setFaceModelsLoaded] = useState(false);
  const [landingStats, setLandingStats] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  // Global Interactive Features
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportAuditData, setReportAuditData] = useState({ riskData: null, attackData: null });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Global Ctrl+K / Cmd+K Command Palette hotkey listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => {
          if (!prev) audioService.playCommand();
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Pre-load biometric model weights from /models
  useEffect(() => {
    let mounted = true;
    const loadFaceModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        if (mounted) setFaceModelsLoaded(true);
      } catch (err) {
        console.warn("Face models failed to load or /models missing:", err);
      }
    };
    loadFaceModels();
    return () => {
      mounted = false;
    };
  }, []);

  // Poll landing page statistics for the pulse strip
  useEffect(() => {
    if (booting || systemStarted) return;
    let cancelled = false;

    const fetchLandingStats = async () => {
      try {
        const data = await api.getRiskIntelligence();
        if (!cancelled) {
          setLandingStats(data);
          setBackendConnected(true);
        }
      } catch {
        if (!cancelled) setBackendConnected(false);
      }
    };

    fetchLandingStats();
    const interval = setInterval(fetchLandingStats, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [booting, systemStarted]);

  // Auth & Boot Handlers
  const handleOpenFaceAuth = () => {
    audioService.playClick();
    setShowFaceAuth(true);
  };

  const handleFaceAuthSuccess = () => {
    setShowFaceAuth(false);
    audioService.playActivation();
    setBooting(true);
  };

  const handleBootComplete = () => {
    setBooting(false);
    setSystemStarted(true);
    audioService.playSuccess();
    showToast("AURA DEFENSIVE WORKSTATION ONLINE", "success");
  };

  const handleOpenPasscodeModal = () => {
    audioService.playClick();
    setShowPasscodeModal(true);
  };

  const handlePasscodeSuccess = () => {
    setShowPasscodeModal(false);
    audioService.playActivation();
    showToast("MASTER PASSCODE VERIFIED • ACCESS AUTHORIZED", "success");
    setBooting(true);
  };

  const handleOpenOperatorAuth = () => {
    audioService.playClick();
    setShowOperatorAuthModal(true);
  };

  const handleOperatorAuthSuccess = (user) => {
    setShowOperatorAuthModal(false);
    setCurrentUser(user);
    audioService.playActivation();
    showToast(`OPERATOR AUTHORIZED: ${(user.full_name || user.username).toUpperCase()} (${user.role})`, "success");
    setBooting(true);
  };

  const handleLogout = () => {
    audioService.playCommand();
    localStorage.removeItem("aura_current_user");
    setCurrentUser(null);
    setActiveModule(null);
    setSystemStarted(false);
    showToast("OPERATOR LOGGED OUT • WORKSTATION SECURED", "info");
  };

  // Module Navigation Handlers
  const handleOpenModule = (moduleId) => {
    audioService.playCommand();
    setActiveModule(moduleId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    audioService.playClick();
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate Executive Security Audit Report
  const handleGenerateAuditReport = async () => {
    try {
      audioService.playCommand();
      showToast("COMPUTING EXECUTIVE AUDIT TELEMETRY...", "info");
      const [riskData, attackData] = await Promise.all([
        api.getRiskIntelligence().catch(() => null),
        api.getAttackSurface().catch(() => null),
      ]);
      setReportAuditData({ riskData, attackData });
      setIsReportModalOpen(true);
      showToast("AUDIT REPORT READY FOR PREVIEW & PDF EXPORT", "success");
    } catch {
      setIsReportModalOpen(true);
    }
  };

  // Command Palette Action Handler
  const handlePaletteAction = (actionId) => {
    if (actionId === "audit-report") {
      handleGenerateAuditReport();
    } else if (actionId === "toggle-audio") {
      const enabled = audioService.toggleSound();
      showToast(enabled ? "CYBER AUDIO ENGAGED" : "CYBER AUDIO MUTED", "info");
    } else if (actionId === "simulate-attack") {
      if (!systemStarted) setSystemStarted(true);
      handleOpenModule("what-if-engine");
      showToast("WARGAME SIMULATOR READY", "warning");
    } else if (actionId === "lock-workstation") {
      setActiveModule(null);
      setSystemStarted(false);
      showToast("WORKSTATION LOCKED", "info");
    }
  };

  return (
    <div className="aura-app-root">
      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectModule={(id) => {
          if (!systemStarted) setSystemStarted(true);
          handleOpenModule(id);
        }}
        onAction={handlePaletteAction}
      />

      {/* Interactive In-App Audit Report Preview Modal */}
      <AuditReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        riskData={reportAuditData.riskData}
        attackData={reportAuditData.attackData}
      />

      {/* Global HUD Toast Notification */}
      {toast && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* RENDER ACTIVE INTELLIGENCE MODULE */}
      {activeModule ? (
        <div className="module-page-wrapper">
          <SOCHeader
            activeModule={activeModule}
            onSelectModule={handleOpenModule}
            onBackToDashboard={handleBackToDashboard}
            onOpenPalette={() => setIsPaletteOpen(true)}
            onGenerateReport={handleGenerateAuditReport}
            currentUser={currentUser}
            onLogout={handleLogout}
            backendConnected={backendConnected}
          />
          <div className="module-view-body">
            {activeModule === "system-monitoring" && <SystemMonitoring />}
            {activeModule === "attack-surface" && <AttackSurface />}
            {activeModule === "risk-intelligence" && <RiskIntelligence />}
            {activeModule === "financial-risk" && <FinancialRisk />}
            {activeModule === "what-if-engine" && <WhatIfEngine />}
            {activeModule === "investment-optimizer" && <InvestmentOptimizer />}
            {activeModule === "aura-voice" && <AIAssistant onOpenModule={handleOpenModule} />}
            {activeModule === "file-security" && <FileSecurity />}
            {activeModule === "vision-intelligence" && <VisionIntelligence />}
          </div>
        </div>
      ) : systemStarted ? (
        /* RENDER SOC COMMAND CENTER */
        <div className="command-center-wrapper">
          <SOCHeader
            activeModule={null}
            onSelectModule={handleOpenModule}
            onBackToDashboard={handleBackToDashboard}
            onOpenPalette={() => setIsPaletteOpen(true)}
            onGenerateReport={handleGenerateAuditReport}
            currentUser={currentUser}
            onLogout={handleLogout}
            backendConnected={backendConnected}
          />
          <CommandCenter
            onOpenModule={handleOpenModule}
            onOpenPalette={() => setIsPaletteOpen(true)}
            onGenerateReport={handleGenerateAuditReport}
          />
        </div>
      ) : (
        /* RENDER MAIN LANDING EXPERIENCE */
        <div className="landing-page">
          {/* Dynamic Storm Atmosphere */}
          <div className="storm-bg">
            <div className="lightning lightning-1"></div>
            <div className="lightning lightning-2"></div>
          </div>

          {/* Cyber Rotating Energy Engines */}
          <div className="engine engine-1"></div>
          <div className="engine engine-2"></div>
          <div className="engine engine-3"></div>

          {/* Hero Section */}
          <LandingHero
            onOpenFaceAuth={handleOpenFaceAuth}
            onOpenOperatorLogin={handleOpenOperatorAuth}
            onGuestAccess={handleOpenPasscodeModal}
            onGenerateReport={handleGenerateAuditReport}
            faceModelsLoaded={faceModelsLoaded}
          />

          {/* Telemetry Ticker Marquee */}
          <PulseStrip landingStats={landingStats} />

          {/* 4-Stage Operational Pipeline */}
          <PipelineSection />

          {/* 9-Module Feature Showcase */}
          <ShowcaseSection onInitialize={handleOpenFaceAuth} />

          {/* Footer Branding */}
          <LandingFooter />

          {/* Biometric Face Verification Modal */}
          <FaceAuthModal
            isOpen={showFaceAuth}
            onSuccess={handleFaceAuthSuccess}
            onCancel={() => setShowFaceAuth(false)}
            faceModelsLoaded={faceModelsLoaded}
          />

          {/* Operator Security Passcode Override Modal */}
          <OperatorPasscodeModal
            isOpen={showPasscodeModal}
            onSuccess={handlePasscodeSuccess}
            onCancel={() => setShowPasscodeModal(false)}
          />

          {/* Operator Clearance Identity Login & Registration Modal */}
          <OperatorAuthModal
            isOpen={showOperatorAuthModal}
            onSuccess={handleOperatorAuthSuccess}
            onCancel={() => setShowOperatorAuthModal(false)}
          />

          {/* Cyber Boot Initialization Overlay */}
          {booting && <BootScreen onComplete={handleBootComplete} />}
        </div>
      )}
    </div>
  );
}