/**
 * AURA SENTINEL - Centralized API Service
 * Interacts with the FastAPI backend running on http://127.0.0.1:8000
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = options.body ? { "Content-Type": "application/json" } : {};

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`API Error [${response.status}] ${endpoint}: ${errorText}`);
  }

  return response.json();
}

export const api = {
  // Base health
  checkHealth: () => request("/"),

  // Module 01: System Monitoring
  getSystemInfo: () => request("/api/system"),
  getProcesses: () => request("/api/processes"),

  // Module 02: Attack Surface
  getAttackSurface: () => request("/api/attack-surface"),

  // Module 03: Risk Intelligence
  getRiskIntelligence: () => request("/api/risk-intelligence"),

  // Module 04: Financial Risk
  getFinancialRisk: () => request("/api/financial-risk"),

  // Module 06: Investment Optimizer
  getInvestmentOptimizer: () => request("/api/investment-optimizer"),
  analyzeInvestment: (payload) =>
    request("/api/investment-optimizer/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Module 07: AI Voice Assistant & File Ops
  chatWithAura: (payload) =>
    request("/api/aura-assistant/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  moveFile: (source, destination_folder) =>
    request("/api/file-ops/move", {
      method: "POST",
      body: JSON.stringify({ source, destination_folder }),
    }),

  deleteFilesBroad: (paths) =>
    request("/api/file-ops/delete", {
      method: "POST",
      body: JSON.stringify({ paths }),
    }),

  createFolder: (parent_folder, folder_name) =>
    request("/api/file-ops/create-folder", {
      method: "POST",
      body: JSON.stringify({ parent_folder, folder_name }),
    }),

  // Module 08: File Security & Quarantine
  scanFiles: () => request("/api/file-security/scan"),
  quarantineFiles: (paths) =>
    request("/api/file-security/quarantine", {
      method: "POST",
      body: JSON.stringify({ paths }),
    }),
  deleteFilesRecycleBin: (paths) =>
    request("/api/file-security/delete", {
      method: "POST",
      body: JSON.stringify({ paths }),
    }),
  listQuarantine: () => request("/api/file-security/quarantine/list"),
  restoreQuarantine: (quarantine_names) =>
    request("/api/file-security/quarantine/restore", {
      method: "POST",
      body: JSON.stringify({ quarantine_names }),
    }),

  // Module 01: Process Termination Control
  killProcess: (pid) =>
    request("/api/processes/kill", {
      method: "POST",
      body: JSON.stringify({ pid }),
    }),

  // SOC Live Alerts & Attack Simulator
  getSocAlerts: () => request("/api/soc/alerts"),
  simulateAttack: (scenario) =>
    request("/api/soc/simulate-attack", {
      method: "POST",
      body: JSON.stringify({ scenario }),
    }),

  // Telemetry Analytics
  getAnalyticsMetrics: () => request("/api/analytics/metrics"),

  // Module 09: Vision Intelligence
  getVisionStreamUrl: () => `${API_BASE_URL}/api/vision/stream`,

  // Persistent SQLite Database Hub
  getDatabaseEvents: (severity = "ALL", limit = 50) =>
    request(`/api/database/events?severity=${encodeURIComponent(severity)}&limit=${limit}`),
  getDatabaseStats: () => request("/api/database/stats"),
  getMetricsHistory: (limit = 60) => request(`/api/database/metrics-history?limit=${limit}`),
  getThreatActors: () => request("/api/database/threat-actors"),

  // Operator Authentication & User Profiles
  registerOperator: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  loginOperator: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listOperators: () => request("/api/auth/users"),
  saveUserBiometrics: (payload) =>
    request("/api/auth/save-biometrics", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getBiometricsDescriptors: () => request("/api/auth/biometrics/descriptors"),
};


