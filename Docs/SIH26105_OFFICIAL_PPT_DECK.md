# 🛡️ AURA SENTINEL — SMART INDIA HACKATHON 2026 (SIH26105)
## FINAL TECHNICAL AUDIT & EVALUATOR-DEFENSIBLE PRESENTATION SUITE
**Team:** ByteForce_1 | **Team ID:** 180219 | **College:** Skyline Institute of Engineering and Technology, Greater Noida  
**Theme:** Blockchain & Cybersecurity | **Organization:** AICTE (Cyber Security Cell) & Ministry of Education Innovation Cell (MIC)  
**Core Problem Statement:** AI-Powered Continuous Cyber Risk Quantification and Investment Optimization Platform (SIH26105)

---

## 📑 TABLE OF CONTENTS
1. [Codebase Feature Implementation Audit (Status & Evidence)](#1-codebase-feature-implementation-audit)
2. [Numerical Claims & Performance Benchmark Audit](#2-numerical-claims--benchmark-audit)
3. [The Audited 14-Slide Presentation Deck](#3-the-audited-14-slide-presentation-deck)
4. [Slide-by-Slide Speaker Notes](#4-slide-by-slide-speaker-notes)
5. [5-Minute Pitch Presentation Script](#5-5-minute-pitch-presentation-script)
6. [5-Minute Live Demo Playbook](#6-5-minute-live-demo-playbook)
7. [Top 20 Evaluator Questions & Technically Honest Answers](#7-top-20-evaluator-questions--winning-answers)
8. [Final SIH Submission & Verification Checklist](#8-final-sih-submission-checklist)

---

## 1. CODEBASE FEATURE IMPLEMENTATION AUDIT

Implementation Status Legend:
- **IMPLEMENTED**: Complete, fully functional, and demonstrable live on current build.
- **PARTIALLY IMPLEMENTED**: Functional backend or client component with simulated / localized scope.
- **PROTOTYPE**: Working algorithmic implementation grounded on sample/deterministic heuristics.
- **CONCEPT / FUTURE**: Architecturally defined, mathematical model established, but planned for future enterprise scale.

| Feature / Subsystem | Implementation Status | Code Evidence & File Reference |
| :--- | :---: | :--- |
| **React 19 Frontend SOC** | **IMPLEMENTED** | `Frontend/src/App.jsx`, `Frontend/src/components/dashboard/CommandCenter.jsx` (Vite 8, 11 interactive modules) |
| **FastAPI Async Backend Kernel** | **IMPLEMENTED** | `Backend/main.py` lines 1–2633 (Uvicorn running on `0.0.0.0:8000`, 50+ REST endpoints) |
| **System Compute Monitoring** | **IMPLEMENTED** | `Backend/main.py` lines 79–100 (`psutil.cpu_percent`, `psutil.virtual_memory`, disk usage) |
| **Process Monitoring & Termination**| **IMPLEMENTED** | `Backend/main.py` lines 101–150 (`get_provesses`) & lines 1939–1960 (`kill_process`) |
| **Attack Surface & Open-Port Analysis**| **IMPLEMENTED** | `Backend/main.py` lines 419–495 (`psutil.net_connections(kind='inet')`, `classify_port_threat`) |
| **Danger Port Remediation** | **IMPLEMENTED** | `Backend/main.py` lines 498–550 (`remediate_attack_surface_port`) & lines 703–750 (`terminate_danger_ports`) |
| **Risk Intelligence Scorer** | **IMPLEMENTED** | `Ai_Engine/Risk_engine/risk_scorer.py` & `Backend/main.py` lines 930–978 (Weighted multi-factor score 0–100) |
| **Financial Risk Calculation** | **PROTOTYPE** | `Ai_Engine/Risk_engine/financial_engine.py` lines 12–56 (`FinancialExposureEngine.calculate_exposure`) |
| **Expected Annual Loss (EAL)** | **PROTOTYPE** | `Ai_Engine/Risk_engine/financial_engine.py` line 20 (`BASE_HOURLY_LOSS * risk_multiplier * downtime_hours`) |
| **Value at Risk (VaR)** | **CONCEPT / FUTURE** | Scoped in roadmap for probabilistic Monte Carlo distribution modeling under cloud data feeds |
| **What-If Scenario Simulation** | **IMPLEMENTED** | `Frontend/src/components/modules/WhatIfEngine.jsx` lines 50–150 (Hypothetical parameter tuning) |
| **MITRE ATT&CK Wargame Simulator** | **IMPLEMENTED** | `Frontend/src/components/modules/WhatIfEngine.jsx` lines 5–51 (T1110 Brute Force, T1499 DDoS, T1046 Scan) |
| **Budget Investment Optimizer** | **PROTOTYPE** | `Ai_Engine/Risk_engine/financial_engine.py` lines 59–137 (`optimize_investment`, Essential/Pro/Enterprise) |
| **ROSI Calculation** | **PROTOTYPE** | `Ai_Engine/Risk_engine/financial_engine.py` lines 106–107 (`roi = round((net_benefit / plan['cost']) * 100)`) |
| **Blockchain Merkle Ledger** | **IMPLEMENTED** | `Backend/blockchain_ledger.py` lines 30–47 (`compute_merkle_root`) & lines 49–103 (`Block` class) |
| **Proof-of-Work (PoW) Mining** | **IMPLEMENTED** | `Backend/blockchain_ledger.py` lines 226–234 (Dynamic nonce discovery with leading-zero hash target) |
| **Tamper Detection & Verification** | **IMPLEMENTED** | `Backend/blockchain_ledger.py` lines 250–310 (`verify_integrity`) & lines 316–335 (`simulate_tamper_attack`) |
| **SQLite 3 Storage Hub** | **IMPLEMENTED** | `Database/db.py` & `Backend/data/aura.db` (High-concurrency WAL mode, 6 operational tables) |
| **Sensitive File & Credential Scanner**| **IMPLEMENTED** | `Backend/main.py` lines 1244–1330 (`scan_files` with regex for API keys, passwords, .env tokens) |
| **File Quarantine Isolation Vault** | **IMPLEMENTED** | `Backend/main.py` lines 1381–1440 (`quarantine_files`) & lines 1484–1520 (`restore_quarantine`) |
| **Client Biometric Face Auth** | **PROTOTYPE** | `Frontend/src/components/common/FaceAuthModal.jsx` (`face-api.js` client descriptor verification) |
| **Operator Presence Auto-Lock** | **IMPLEMENTED** | `Ai_Engine/Tracking/presence_lock.py` (`ultralytics YOLO('yolov8n.pt')` + `LockWorkStation`) |
| **Touchless Neural Hand Mouse** | **IMPLEMENTED** | `Ai_Engine/Detection/gesture_controller.py` (`mediapipe 0.10.14` hand landmarks + `pyautogui`) |
| **AI Assistant / Voice Interaction** | **PARTIALLY IMPLEMENTED**| `Backend/main.py` lines 1653–1705 (`aura_chat` with Groq API integration + Web Speech API fallback) |
| **Executive PDF Audit Report** | **IMPLEMENTED** | `Frontend/src/services/reportGenerator.js` & `Frontend/src/components/common/AuditReportModal.jsx` |

---

## 2. NUMERICAL CLAIMS & BENCHMARK AUDIT

To maintain 100% technical defensibility before evaluators, all unsupported, exaggerated, or absolute claims have been audited and corrected:

| Original Unsubstantiated Claim | Audit Finding | Evaluator-Safe Defensible Replacement |
| :--- | :--- | :--- |
| *"10,000+ colleges protected"* | No external production deployment exists yet. | *"Designed to address the cybersecurity compliance and budget needs of Indian higher education institutions."* |
| *"5,100+ cyber attacks weekly"* | Regional survey statistic without real-time API telemetry proof. | *"Addresses the heightened threat landscape facing Indian academic and technical research networks."* |
| *"Replaces ₹30L–₹60L/year foreign tools"* | Broad marketing claim lacking direct procurement audits. | *"Offers a local-first alternative to costly proprietary enterprise SIEM/GRC license subscriptions."* |
| *"Sub-30ms inference / <5ms blockchain"* | Hardware-dependent metrics without standardized benchmark suite. | *"Designed as a lightweight local-first architecture optimized for standard quad-core CPU systems."* |
| *"CPU utilization <45% / RAM <350MB"* | Fluctuates based on active background workloads. | *"Designed to operate efficiently on commodity desktop hardware without mandatory cloud GPU infrastructure."* |
| *"Impossible to tamper / 100% secure"* | Mathematically inaccurate for any standalone computational system. | *"Tamper-Evident Audit Ledger: Unauthorized historical alterations cause immediate cryptographic verification failure."* |
| *"100% touchless / 100% accurate"* | Vision confidence varies with ambient lighting and occlusion. | *"Heuristic gesture controller with exponential moving average (EMA) smoothing for stable desktop automation."* |
| *"AICTE HQ, IIT Delhi, NIT Surathkal Nodes"* | Implied active institutional partnership without formal authorization. | *"Proposed Future Multi-Institution Architecture: Conceptual Central Governance, Regional Validator, and Campus Auditor nodes."* |

---

## 3. THE AUDITED 14-SLIDE PRESENTATION DECK

*(This 14-slide structure directly matches the generated PowerPoint presentation at `C:\Users\aryan\OneDrive\Desktop\AURA_SENTINEL_SIH26105.pptx`)*

### 🟢 SLIDE 1: TITLE & METADATA
- **Header:** SMART INDIA HACKATHON 2026
- **Title:** AURA SENTINEL
- **Subtitle:** AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform
- **Metadata Card:**
  - **Team Name & ID:** ByteForce_1 (Official SIH Team ID: 180219)
  - **Institute:** Skyline Institute of Engineering and Technology, Greater Noida
  - **Team Members:** Aryan Baghel (Lead), Kirti, Hitesh Chauhan, Avinav Jha, Sharim Khan, Aman Sekh
  - **Problem Statement ID:** SIH26105 (MIC & AICTE Cyber Security Cell)
  - **Theme:** Blockchain & Cybersecurity (Software Solution)
  - **Core Mission:** Correlating technical security telemetry with business asset value to provide continuous financial exposure estimates and budget-constrained defense optimization.

---

### 🟢 SLIDE 2: THE PROBLEM STATEMENT
- **Header:** Slide 02 | The Problem: The Disconnect in Cyber Risk Communication
- **Left Card (Current Industry Limitations):**
  - ❌ **Qualitative Risk Ratings:** Vulnerability scanners produce labels like 'High', 'Medium', 'Low' which fail to convey actual monetary liability to leadership.
  - ❌ **Stale Risk Registers:** Traditional compliance relies on annual or quarterly manual audits, missing dynamic threat evolution and emerging vulnerabilities.
  - ❌ **Suboptimal Budget Allocation:** Organizations invest in security controls without quantifiable Return on Security Investment (ROSI) metrics.
  - ❌ **Log Vulnerability:** Centralized audit logs in traditional databases remain susceptible to internal modification during a breach investigation.
- **Right Card (The AURA Sentinel Approach):**
  - ✔ **Monetary Cyber Risk Translation:** Translates real-time socket exposures, process states, and compute telemetry into prototype Expected Annual Loss (EAL) in ₹ INR.
  - ✔ **Continuous Telemetry Correlation:** Continuously ingests local host metrics and open attack surfaces rather than relying on static questionnaires.
  - ✔ **Budget-Constrained Optimization:** Evaluates candidate defense controls under an explicit institutional budget to maximize risk reduction.
  - ✔ **Tamper-Evident Audit Ledger:** Anchors risk evaluations and mitigation actions in a SHA-256 Merkle blockchain to provide cryptographic audit verification.

---

### 🟢 SLIDE 3: CORE SYSTEM WORKFLOW
- **Header:** Slide 03 | Core System Workflow: Technical Signals to Executive Decision
- **Flow Steps:**
  1. **Technical Telemetry:** Host metrics, listening sockets, CPU/RAM stress, and sensitive file exposures.
  2. **Continuous Analysis:** Correlates exposure counts with system vulnerability factors and threat indicators.
  3. **Prototype Exposure:** Computes hourly operational downtime costs and prototype Expected Annual Loss (₹).
  4. **What-If Scenarios:** Simulates threat scenarios and hypothetical control parameter tuning.
  5. **Knapsack Optimizer:** Selects optimal defense packages under explicit budget constraints to maximize ROSI.
  6. **Cryptographic Audit:** Records assessments and mitigations into a tamper-evident SHA-256 Merkle ledger.

---

### 🟢 SLIDE 4: TECHNICAL ARCHITECTURE & IMPLEMENTATION STATUS
- **Header:** Slide 04 | Technical Architecture & Implementation Classification
- **Column 1: Layer 1 — Presentation & SOC**
  - React 19 + Vite SOC Dashboard — `● IMPLEMENTED`
  - Live Threat Telemetry & Port Monitor — `● IMPLEMENTED`
  - Global Command Palette (Ctrl+K) — `● IMPLEMENTED`
  - Executive Audit Report Generator — `● IMPLEMENTED`
  - Client Biometric Face Verification — `◐ PROTOTYPE`
  - Procedural Cyber Audio Cues — `● IMPLEMENTED`
- **Column 2: Layer 2 — Computational Core**
  - FastAPI Async Kernel (Uvicorn) — `● IMPLEMENTED`
  - Attack Surface Port Inspector — `● IMPLEMENTED`
  - Sensitive Credential Scanner — `● IMPLEMENTED`
  - File Isolation Quarantine Vault — `● IMPLEMENTED`
  - Prototype Financial Exposure (EAL) — `◐ PROTOTYPE`
  - Knapsack Investment Optimizer — `◐ PROTOTYPE`
  - What-If Scenario Simulation Engine — `● IMPLEMENTED`
- **Column 3: Layer 3 — Trust & Interaction**
  - SHA-256 Merkle Risk Ledger — `● IMPLEMENTED`
  - Proof-of-Work Mining Engine — `● IMPLEMENTED`
  - Tamper Detection & Verification — `● IMPLEMENTED`
  - SQLite 3 WAL Mode Storage Hub — `● IMPLEMENTED`
  - YOLOv8 Operator Presence Lock — `● IMPLEMENTED`
  - MediaPipe Touchless Gesture Control — `● IMPLEMENTED`
  - Value at Risk (Monte Carlo VaR) — `○ FUTURE`

---

### 🟢 SLIDE 5: ATTACK SURFACE & RISK INTELLIGENCE
- **Header:** Slide 05 | Attack Surface Telemetry & Risk Scoring
- **Left Card: Host Telemetry Ingestion (Implemented):**
  - • **Active Socket Inspection:** Queries network socket table via `psutil`, isolating listening ports and tracking bound IP interfaces.
  - • **Port Threat Categorization:** Heuristically maps sensitive ports (e.g. 22 SSH, 3389 RDP, 445 SMB) vs standard application ports.
  - • **Resource Stress Telemetry:** Monitors CPU percent, virtual memory usage, and disk saturation as stability and availability factors.
  - • **Active Port Remediation:** Includes prototype capability to terminate rogue listening processes or suppress non-critical noise.
- **Right Card: Weighted Risk Scoring Model:**
  - Formula: $\text{Technical Risk Score} = f(\text{Open Ports}, \text{CPU}, \text{RAM}, \text{Disk})$
  - • **Port Exposure Factor:** Up to 30 points based on listening socket count (>15 ports = +30, >8 ports = +20, >3 ports = +10).
  - • **Compute Stress Factor:** Up to 25 points for sustained CPU utilization (>90% = +25, >75% = +15).
  - • **Memory Exhaustion Factor:** Up to 25 points for virtual memory saturation (>90% = +25, >80% = +15).
  - • **Storage Saturation Factor:** Up to 20 points for critical disk capacity (>95% = +20, >85% = +12).
  - • **Threshold Normalization:** Clamped to 0–100 scale, categorizing system state into LOW, MODERATE, or HIGH risk.

---

### 🟢 SLIDE 6: PROTOTYPE FINANCIAL RISK MODEL
- **Header:** Slide 06 | Prototype Financial Risk & Exposure Modeling (FAIR Grounded)
- **Left Card: Prototype Formulation in ₹ INR:**
  - • **Base Operational Loss Rate:** Calibrated at ₹15,000/hr as an illustrative enterprise baseline rate.
  - • **Risk-Adjusted Hourly Loss:** $\text{Hourly Loss} = ₹15,000 \times (1.0 + \text{Technical Risk Score} / 100)$.
  - • **Estimated Downtime Duration:** Dynamic mapping based on severity: HIGH = 8 hrs, MODERATE = 4 hrs, LOW = 1 hr.
  - • **Incident Direct Cost:** $\text{Direct Cost} = \text{Risk-Adjusted Hourly Loss} \times \text{Downtime Hours}$.
  - • **Recovery Overhead:** $\text{Recovery Cost} = \text{Direct Cost} \times 0.35$ (forensics & incident cleanup).
  - • **Total Estimated Exposure:** $\text{Total} = \text{Direct Incident Cost} + \text{Recovery Overhead} + \text{Asset Impact Factor}$.
- **Right Card: FAIR Alignment & Future Modeling:**
  - ✔ **Factor Analysis of Information Risk (FAIR):** Standardizes decomposing risk into Threat Event Frequency (TEF) and Loss Magnitude (LM).
  - ✔ **Prototype Implementation Status:** `◐ PROTOTYPE` — Uses deterministic actuarial equations based on live host signals and user-supplied asset valuations.
  - ✔ **Value at Risk (VaR) Distinction:** `○ FUTURE ENHANCEMENT` — Monte Carlo probabilistic VaR distribution (e.g. 95% annual confidence) is scoped for future cloud telemetry integration.
  - ✔ **Defensible Positioning:** Figures represent illustrative calculated risk exposure under current host conditions, not guaranteed financial forecasts.

---

### 🟢 SLIDE 7: WHAT-IF SCENARIO SIMULATION
- **Header:** Slide 07 | Decision Support: What-If Scenario Simulation Engine
- **Left Card: Hypothetical Tuning (Implemented):**
  - • **Interactive Parameter Sliders:** Allows security operators to model varying CPU, memory, disk, and exposed port counts.
  - • **Live Exposure Re-calculation:** Instantly computes simulated risk score and projected monetary exposure as parameters shift.
  - • **Remediation Impact Assessment:** Demonstrates how reducing exposed ports from 18 to 2 reduces simulated business exposure.
  - • **Single-Click Live Sync:** Features button to pull actual live host metrics into the simulator as a baseline reference.
- **Right Card: MITRE ATT&CK Wargame Scenarios:**
  - ⚔ **SSH / RDP Brute Force Storm (T1110):** Simulates credential-stuffing pressure against remote daemons, generating live security alert logs.
  - ⚔ **Distributed SYN Flood DDoS (T1499):** Models volumetric connection exhaustion and elevated risk scoring.
  - ⚔ **Aggressive Reconnaissance Scan (T1046):** Simulates full-range port sweeps attempting to fingerprint local services.
  - ⚔ **Interactive Defense Trigger:** Operator triggers simulated mitigation, logging the defensive event into the persistent SQLite database.

---

### 🟢 SLIDE 8: BUDGET-CONSTRAINED INVESTMENT OPTIMIZER
- **Header:** Slide 08 | Budget-Constrained Security Investment Optimization
- **Left Card: Knapsack Optimization Logic:**
  - **1. Input Parameters:** Monthly Budget (e.g. ₹50,000 – ₹1,00,000), Managed System Count, and Critical Data Value (₹).
  - **2. Candidate Defense Packages:** Evaluates defined control tiers:
    - Essential (₹25,000/mo, ~15% Risk Reduction)
    - Professional (₹75,000/mo, ~35% Risk Reduction)
    - Enterprise (₹1,50,000/mo, ~60% Risk Reduction).
  - **3. Budget Feasibility Filter:** Constraint: $\text{Package Cost} \le \text{Stated Monthly Budget}$.
  - **4. Return on Security Investment (ROSI):** $\text{ROSI (\%)} = \frac{\text{Potential Savings} - \text{Package Cost}}{\text{Package Cost}} \times 100$.
- **Right Card: Decision Support Output:**
  - ✔ **Ranked Recommendation Score:** Calculates composite score based on affordability (+40), positive net benefit (+30), and scaled ROI (+30).
  - ✔ **Automated Plan Selection:** Recommends the affordable tier delivering highest net financial savings within budget.
  - ✔ **Tailored Security Actions:** Generates prioritized recommendations (e.g. MFA enforcement, offline backup verification, port closure).
  - ✔ **Prototype Status Disclosure:** `◐ PROTOTYPE` — Illustrates algorithmic budget allocation; real enterprise deployment would ingest specific vendor RFP quotes.

---

### 🟢 SLIDE 9: BLOCKCHAIN TAMPER-EVIDENT AUDIT LEDGER
- **Header:** Slide 09 | Trust Layer: Tamper-Evident SHA-256 Merkle Audit Ledger
- **Left Card: Cryptographic Ledger Mechanism:**
  - • **Security Event Trigger:** Risk assessments, threat quarantines, and budget changes emit structured payloads.
  - • **Merkle Root Calculation:** Pairwise SHA-256 hashing condenses arbitrary payload keys into a single cryptographic Merkle root.
  - • **Proof-of-Work Mining:** Calculates candidate header hash with dynamic nonce until satisfying target difficulty prefix (`0`).
  - • **Chained Block Header:** $\text{Block Hash} = \text{SHA256}(\text{Index} + \text{Timestamp} + \text{Event} + \text{MerkleRoot} + \text{PrevHash} + \text{Nonce})$.
  - • **Defensible Terminology:** Described as a **Tamper-Evident Audit Ledger** — unauthorized modifications break cryptographic chain verification.
- **Right Card: Verification & Tamper Demo:**
  - ✔ **Full Chain Validation (`verify_integrity`):** Traverses chain from Genesis to tip, verifying `previous_hash` links, recomputed Merkle roots, and block hashes.
  - ✔ **Simulate Tamper Attack (DEMO):** Modifies stored data payload of Block #1 in JSON storage to simulate rogue log alteration.
  - ✔ **Instant Cryptographic Detection:** Next integrity audit immediately detects Merkle root mismatch and broken hash chain, flagging the exact invalid block.
  - ✔ **Consensus State Restoration:** Restores verified snapshot from backup memory pool, returning ledger to verified state.

---

### 🟢 SLIDE 10: ENDPOINT & OPERATOR SECURITY CAPABILITIES
- **Header:** Slide 10 | Supporting Endpoint Capabilities: Physical Presence & Interaction
- **Left Card: Zero-Trust Physical Auto-Lock:**
  - • **Problem Addressed:** Physical workstation access remains a frequent insider threat vector if an operator walks away leaving a console unlocked.
  - • **YOLOv8 Operator Tracking:** Ultralytics YOLOv8-nano monitors operator presence in local webcam feed.
  - • **Configurable Grace Period:** If operator departs, a countdown banner alerts the user before executing OS-level `LockWorkStation` call.
  - • **Supporting Role in SIH:** Presented accurately as an endpoint hardening feature, secondary to the core financial risk quantification engine.
- **Right Card: Touchless Neural Gesture Control:**
  - ✔ **MediaPipe Hand Landmarks:** Tracks 21 3D hand coordinates locally using Google MediaPipe Hand Landmarker.
  - ✔ **Deterministic Vector Logic:** Crossed fingers (Index over Middle) detected via coordinate inversion vector (`mcp_diff * tip_diff < 0`).
  - ✔ **Gesture Capabilities:**
    - ☝️ Index Point: New Folder hotkey
    - 🤞 Crossed Fingers: File delete action
    - 🤏 Pinch & Slide: System volume control
    - ✌️ Peace Sign: Application window switch.
  - ✔ **Architecture Positioning:** Designed to run locally on CPU hardware without requiring external cloud GPU servers.

---

### 🟢 SLIDE 11: REGULATORY & FRAMEWORK ALIGNMENT
- **Header:** Slide 11 | Regulatory Framework Alignment & Control Mapping
- **Left Card: Indian Regulatory Context:**
  - 📜 **CERT-In Cyber Security Directions (April 2022):** Mandates 180-day preservation of cybersecurity incident logs. AURA's blockchain ledger provides cryptographic evidence of non-alteration.
  - 📜 **RBI Cyber Security Framework:** Supports risk threshold monitoring, sensitive port alerting, and cyber resilience disclosures for institutional banking environments.
  - 📜 **SEBI Cybersecurity Resilience Framework:** Addresses board-level risk metrics, technical asset inventory tracking, and systematic risk governance.
  - 📜 **DPDP Act 2023 Compliance Support:** Regex credential scanner flags unmasked Aadhaar, PAN numbers, and private keys in scanned directories.
- **Right Card: Global Framework Mapping:**
  - 🌐 **NIST Cybersecurity Framework 2.0:** Structured mapping across core functions (Identify, Protect, Detect, Respond, Recover).
  - 🌐 **ISO/IEC 27001 (A.12 Operations Security):** Aligns with technical control logging and vulnerability management clauses.
  - 🌐 **CIS Controls v8:** Supports Control 1 (Enterprise Assets), Control 4 (Secure Configuration), and Control 8 (Audit Log Management).
  - 🌐 **Defensible Claim Note:** Framed accurately as **'control alignment and compliance-supporting capabilities'**, not official government certifications.

---

### 🟢 SLIDE 12: PROPOSED MULTI-INSTITUTION ARCHITECTURE
- **Header:** Slide 12 | Proposed Architecture: Future Multi-Institution Deployment
- **Badge:** PROPOSED ARCHITECTURE FOR FUTURE MULTI-INSTITUTION DEPLOYMENT (CONCEPTUAL SCALING)
- **Node 01: Central Governance Node (Proposed Central Authority)**
  - • Aggregates anonymized risk exposure indexes across institutions
  - • Sets baseline risk evaluation standards
  - • Distributes global threat intelligence advisories
  - • Acts as primary consensus coordinator
- **Node 02: Regional Validator Node (Proposed Lead Technical Campus)**
  - • Validates consensus blocks via independent Merkle checks
  - • Executes regional peer risk verification
  - • Distributes computational load for consortium mining
  - • Maintains verifiable mirror of consortium ledger
- **Node 03: Institutional Auditor Node (Proposed Individual College Node)**
  - • Operates local-first agent monitoring campus endpoints
  - • Emits tamper-evident risk assessments to the ledger
  - • Validates compliance posture against regulatory requirements
  - • Prevents local insider repudiation of breach incidents

---

### 🟢 SLIDE 13: PROJECT ROADMAP & IMPLEMENTATION STATUS
- **Header:** Slide 13 | Implementation Status Matrix & Development Roadmap
- **Left Card: Runnable in Current MVP (Today):**
  - ✔ **Host Telemetry & Port Inspector:** Live extraction of open sockets, CPU/RAM utilization, and process states (`psutil`).
  - ✔ **Prototype Financial Exposure (EAL):** Live computation of hourly downtime loss and estimated incident cost in ₹ INR.
  - ✔ **What-If Simulation Engine:** Interactive parameter tuning and MITRE attack vector wargaming.
  - ✔ **Budget Investment Optimizer:** Knapsack evaluation of defense packages, ROSI %, and tailored action list.
  - ✔ **Blockchain Ledger & Tamper Demo:** SHA-256 blocks with Merkle roots, Proof-of-Work mining, and live tamper simulation.
  - ✔ **Physical Security & Gestures:** YOLOv8 operator auto-lock + MediaPipe touchless OS mouse controls.
- **Right Card: Future Production Roadmap:**
  - 🚀 **Enterprise Ingestion Connectors (Q1):** Native log forwarders for Wazuh, Splunk, CrowdStrike EDR, and AWS/Azure CSPM.
  - 🚀 **Monte Carlo Probabilistic VaR (Q2):** Statistical probability density distributions estimating Value at Risk at 95% confidence intervals.
  - 🚀 **Multi-Campus Consortium Network (Q2):** Deploying real peer-to-peer validator nodes across participating universities.
  - 🚀 **Automated Dynamic Control Discovery (Q3):** Direct API integration with IT procurement systems for dynamic security solution pricing.
  - 🚀 **Full DPDP Audit Automation (Q3):** Automated compliance reports formatted for direct submission to Indian regulatory authorities.

---

### 🟢 SLIDE 14: 5-MINUTE LIVE DEMO PLAYBOOK
- **Header:** Slide 14 | Evaluator-Grounded 5-Minute Live Demonstration Sequence
- **Step-by-Step Runnable Timeline:**
  - ⏱ **0:00 – 0:45 | Dashboard & Host Status:** Launch AURA SOC Dashboard (Module 01). Show live compute telemetry, listening socket counts, and normalized technical risk score.
  - ⏱ **0:45 – 1:30 | Attack Surface Detection:** Navigate to Attack Surface (Module 02). Highlight active listening ports, danger classifications, and process IDs.
  - ⏱ **1:30 – 2:15 | Prototype Financial Risk (EAL):** Open Financial Risk (Module 04). Demonstrate live translation of socket stress into hourly downtime rate and estimated exposure in ₹ INR.
  - ⏱ **2:15 – 3:15 | What-If Scenario Simulation:** Open What-If Engine (Module 05). Adjust sliders to demonstrate exposure reduction; trigger MITRE wargame scenario and log mitigation.
  - ⏱ **3:15 – 4:15 | Budget Investment Optimizer:** Open Investment Optimizer (Module 06). Input ₹1,00,000 budget; execute Knapsack optimizer to display recommended tier and ROSI %.
  - ⏱ **4:15 – 4:45 | Blockchain Tamper Showdown:** Open Blockchain Ledger (Module 10). Run integrity audit (100% valid) ➔ Trigger tamper simulation ➔ Show instant red alert ➔ Restore consensus.
  - ⏱ **4:45 – 5:00 | Executive Audit Report Wrap-up:** Click 'Audit Report' button in navbar. Present printable executive report summarizing compliance alignment and actuarial exposure.

---

## 4. SLIDE-BY-SLIDE SPEAKER NOTES

### Slide 1: Title & Metadata
> *"Good morning respected evaluators. We are Team ByteForce_1, Team ID 180219, representing Skyline Institute of Engineering and Technology, Greater Noida. Today, we present AURA Sentinel for Problem Statement SIH26105 under the Blockchain & Cybersecurity theme. AURA Sentinel bridges the fundamental gap between raw technical security telemetry and business decision-making through continuous actuarial risk quantification and budget-constrained investment optimization."*

### Slide 2: The Problem Statement
> *"Organizations heavily invest in cybersecurity, yet risk is still reported in qualitative labels: High, Medium, or Low. These ratings fail to answer the CFO's core question: 'What is our monetary exposure, and where should we allocate our budget?' Furthermore, annual compliance audits leave stale risk registers, and central database logs remain vulnerable to insider tampering during an incident. AURA Sentinel replaces subjective labels with continuous, mathematically grounded monetary estimates and a tamper-evident audit ledger."*

### Slide 3: Core System Workflow
> *"Our workflow transitions from technical telemetry to executive action in six continuous stages. First, host telemetry and open sockets are collected. Second, technical risk factors are weighted. Third, a prototype financial exposure calculation estimates operational downtime in Indian Rupees. Fourth, What-If scenario simulations model mitigation actions. Fifth, our Knapsack optimizer evaluates candidate defenses against institutional budget limits. Finally, all decisions are permanently committed to a cryptographic ledger."*

### Slide 4: Technical Architecture & Implementation Classification
> *"We maintain strict transparency regarding our engineering progress. As highlighted in our three-tier architecture, our presentation layer, FastAPI async kernel, attack surface monitor, What-If simulation engine, and SHA-256 Merkle blockchain ledger are 100% IMPLEMENTED and runnable today. Our financial exposure and investment optimizer operate as functional PROTOTYPES grounded on the Open FAIR model, while probabilistic Monte Carlo Value-at-Risk modeling represents our FUTURE production roadmap."*

### Slide 5: Attack Surface Telemetry & Risk Scoring
> *"In Module 02, AURA Sentinel inspects local network sockets using psutil, mapping listening interfaces and classifying high-risk ports such as RDP 3389 or SSH 22. Our technical risk engine normalizes port exposure, CPU stress, and virtual memory exhaustion on a 0 to 100 scale, giving security teams instant visibility into host attack surfaces."*

### Slide 6: Prototype Financial Risk Model
> *"Rather than relying on abstract CVE scores, Module 04 translates technical risk into an illustrative Expected Annual Loss prototype calibrated around an operational downtime baseline of ₹15,000 per hour. Based on host stress, estimated downtime duration is projected, generating incident direct costs and recovery overhead. This grounds risk discussions in financial terms understood by institutional leadership."*

### Slide 7: What-If Scenario Simulation Engine
> *"Module 05 empowers CISOs with two proactive decision-support tools. First, hypothetical slider tuning allows operators to simulate the immediate financial impact of closing exposed ports. Second, MITRE ATT&CK wargame scenarios—including T1110 brute force storms and T1499 DDoS attacks—demonstrate simulated automated threat mitigation with persistent event logging."*

### Slide 8: Budget-Constrained Investment Optimizer
> *"When allocating an annual or monthly budget—for example, ₹1,00,000—Module 06 uses a Knapsack algorithm to evaluate candidate defense packages. It calculates Return on Security Investment by comparing potential financial loss reduction against solution cost, recommending the optimal package that maximizes ROSI within explicit budget constraints."*

### Slide 9: Blockchain Tamper-Evident Audit Ledger
> *"In cybersecurity, audit logs must be non-repudiable. Module 10 implements a local SHA-256 Merkle blockchain. Each block seals assessment data, previous-block hashes, and a Proof-of-Work nonce. If an unauthorized insider modifies a historical log in storage, our integrity audit instantly flags the cryptographic mismatch. In our live demo, we will demonstrate a simulated tamper attack and consensus restoration."*

### Slide 10: Endpoint & Operator Security Capabilities
> *"To address physical console vulnerabilities, AURA Sentinel integrates local vision intelligence. Ultralytics YOLOv8 monitors operator presence, automatically locking the workstation if the operator departs. Furthermore, MediaPipe hand landmark tracking provides touchless gesture navigation, operating entirely on CPU without requiring external cloud GPU servers."*

### Slide 11: Regulatory Framework Alignment & Control Mapping
> *"AURA Sentinel aligns with major Indian and global compliance standards: CERT-In's April 2022 mandate for 180-day log preservation via immutable blockchain hashing, the DPDP Act 2023 via sensitive credential scanning, and control mapping against the RBI and SEBI Cyber Resilience Frameworks, ISO 27001, and NIST CSF 2.0."*

### Slide 12: Proposed Multi-Institution Architecture
> *"To illustrate how AURA Sentinel can scale across technical campuses and enterprise consortiums, Slide 12 illustrates our proposed future multi-institution architecture. Central Governance Nodes manage baseline threat policies, Regional Validator Nodes perform independent Merkle checks, and Institutional Auditor Nodes emit local risk evaluations."*

### Slide 13: Project Roadmap & Implementation Status
> *"Slide 13 provides our transparent milestone matrix. Our host telemetry, prototype financial quantification, What-If simulation, investment optimizer, and blockchain ledger are fully operational today. Our future quarters will deliver native enterprise connectors for Wazuh and Splunk, Monte Carlo probabilistic VaR distributions, and multi-campus consortium deployments."*

### Slide 14: 5-Minute Live Demonstration Plan
> *"Our 5-minute live demonstration strictly follows fully runnable features in our current build. Over the next five minutes, we will walk you through our live host telemetry, attack surface detection, prototype financial calculation, What-If wargame simulation, Knapsack investment optimization, and our live blockchain tamper detection showdown."*

---

## 5. 5-MINUTE PITCH PRESENTATION SCRIPT

- **[0:00 – 1:00] The Core Disconnect & Opening Value Proposition:**
  *"Respected evaluators, today enterprise security teams and university IT departments face a fundamental disconnect. Vulnerability scanners deliver thousands of technical alerts labelled 'High', 'Medium', or 'Low'. But when a CISO meets the Board of Directors or CFO, those labels fail to answer two decisive business questions: 'What is our monetary financial liability in Rupees?' and 'How should we optimally allocate our security budget?' AURA Sentinel solves this by correlating technical host signals with business asset value, delivering continuous financial cyber risk quantification, budget-constrained investment optimization, and a tamper-evident blockchain audit ledger."*

- **[1:00 – 2:00] Technical Architecture & Prototype Risk Modeling:**
  *"Our architecture operates on three transparent layers. Layer 1 is a responsive React 19 SOC dashboard. Layer 2 is an asynchronous FastAPI kernel executing continuous telemetry correlation. Based on open listening sockets, CPU saturation, and memory stress, our prototype Financial Exposure Engine calculates risk-adjusted hourly downtime costs calibrated against an enterprise baseline rate. This translates abstract CVE counts into calculated Expected Annual Loss in ₹ INR, allowing leadership to prioritize remediation based on monetary risk."*

- **[2:00 – 3:15] What-If Simulation & Knapsack Investment Optimization:**
  *"To support proactive planning, AURA Sentinel provides a What-If Engine where operators can dynamically tune parameters—such as reducing open ports from 18 to 2—and observe the immediate projected reduction in rupee exposure. Furthermore, when given an explicit institutional budget—such as ₹1,00,000—our Investment Optimizer applies a Knapsack algorithm to evaluate defense tiers (Essential, Professional, and Enterprise). By comparing risk reduction against solution cost, it calculates the Return on Security Investment (ROSI %) and selects the optimal defense portfolio."*

- **[3:15 – 4:15] Trust Layer: Tamper-Evident SHA-256 Merkle Ledger:**
  *"Aligning directly with the Blockchain & Cybersecurity theme, AURA Sentinel addresses insider threat and compliance log tampering. In traditional systems, audit logs stored in relational databases can be altered by compromised administrators. AURA Sentinel anchors every risk evaluation and mitigation action into a SHA-256 Merkle blockchain with lightweight Proof-of-Work. Any unauthorized modification to past records invalidates the Merkle root and breaks the cryptographic hash chain, enabling zero-latency detection during CERT-In and regulatory audits."*

- **[4:15 – 5:00] Feasibility, Regulatory Alignment & Summary:**
  *"AURA Sentinel is built local-first to run efficiently on standard campus CPU hardware without requiring expensive cloud GPU infrastructure. It aligns with CERT-In 180-day log preservation directions, DPDP Act 2023 credential scanning, and control mappings for the RBI, SEBI, and NIST Cybersecurity Frameworks. We invite you to witness our live 5-minute technical demonstration."*

---

## 6. 5-MINUTE LIVE DEMO PLAYBOOK

*(Follow this exact, 100% runnable sequence during the live evaluation)*

### ⏱️ STEP 1 [0:00 – 0:45]: Dashboard & System Monitoring (Module 01)
- **Action:** Open `http://localhost:5173`.
- **Show on screen:** Point to **Module 01: System Monitoring**. Highlight live CPU usage, memory utilization, disk space, and total active network socket count.
- **Narrate:** *"Here you observe AURA Sentinel ingesting live local host telemetry through our FastAPI backend using psutil, establishing the baseline technical state of the host."*

### ⏱️ STEP 2 [0:45 – 1:30]: Attack Surface Inspection & Danger Ports (Module 02)
- **Action:** Click **Module 02: Attack Surface**.
- **Show on screen:** Show the port inventory table. Point out listening ports categorized by threat level (e.g. Web HTTP vs High Sensitivity Remote).
- **Narrate:** *"Module 02 continuously catalogs all active listening sockets, identifying exposed remote access daemons and calculating our open attack surface surface factor."*

### ⏱️ STEP 3 [1:30 – 2:15]: Prototype Financial Risk & EAL Calculation (Module 04)
- **Action:** Click **Module 04: Financial Risk**.
- **Show on screen:** Point to **Estimated Hourly Loss (₹)**, **Estimated Downtime Duration**, and **Total Estimated Financial Exposure (₹)**.
- **Narrate:** *"Rather than an abstract 'Medium' rating, AURA Sentinel computes a prototype Expected Annual Loss based on our baseline operational downtime rate and live host stress, presenting estimated incident costs in ₹ INR."*

### ⏱️ STEP 4 [2:15 – 3:15]: What-If Scenario Simulation (Module 05)
- **Action:** Click **Module 05: What-If Engine**.
- **Show on screen:**
  1. Under Hypothetical Tuning, drag the **Open Ports** slider down from 15 to 2. Show the simulated exposure number dynamically drop.
  2. Switch to the **Wargame Simulator** tab. Select **SSH / RDP Brute Force Storm (T1110)**. Click **[ INITIATE ATTACK SIMULATION ]**. Show live synthetic terminal logs flashing.
  3. Click **[ DEPLOY MITIGATION DEFENSE ]**. Show success confirmation and live event commit.
- **Narrate:** *"The What-If engine enables proactive decision-making. Operators can tune parameters to observe immediate exposure reductions, and simulate MITRE ATT&CK vectors with automated defensive logging."*

### ⏱️ STEP 5 [3:15 – 4:15]: Budget-Constrained Investment Optimizer (Module 06)
- **Action:** Click **Module 06: Investment Optimizer**.
- **Show on screen:** Enter Monthly Budget: **₹1,00,000**, Systems: **25**, Critical Data Value: **₹25,00,000**. Click **[ RUN OPTIMIZATION ENGINE ]**.
- **Show output:** Highlight the selected plan (**Enterprise Defense**), the calculated **ROSI %**, net savings, and prioritized recommendations.
- **Narrate:** *"Our Knapsack optimizer evaluates candidate defense packages against the user's explicit budget limit, recommending the highest ROSI portfolio that maximizes risk reduction per rupee spent."*

### ⏱️ STEP 6 [4:15 – 4:45]: Blockchain Tamper Detection Showdown (Module 10)
- **Action:** Click **Module 10: Blockchain Ledger**.
- **Show on screen:**
  1. Show existing blocks linked from Genesis Node. Click **[ 🛡️ RUN INTEGRITY AUDIT ]** ➔ Displays **✓ 100% Cryptographically Valid**.
  2. Click **[ ⚠️ SIMULATE TAMPER ATTACK ]** ➔ Block #1 payload in storage is altered.
  3. UI immediately triggers crimson alert banner: **CRITICAL AUDIT BREACH: Merkle root mismatch at Block #1!**
  4. Click **[ 🔄 RESTORE CONSENSUS ]** ➔ Ledger verified and restored to 100% GREEN.
- **Narrate:** *"This demonstrates cryptographic non-repudiation. When an unauthorized user modifies historical logs, the Merkle root breaks, instantly flagging the tampered block during an audit."*

### ⏱️ STEP 7 [4:45 – 5:00]: Executive PDF Audit Report (Navbar Action)
- **Action:** Click the **`📄 AUDIT REPORT`** button in the top navigation bar.
- **Show on screen:** Display the clean executive audit modal summarizing technical findings, actuarial financial liabilities, and regulatory framework mapping.
- **Narrate:** *"With a single click, AURA Sentinel exports a board-ready audit summary, bridging the technical-to-executive communication gap."*

---

## 7. TOP 20 EVALUATOR QUESTIONS & WINNING ANSWERS

### Q1: "What is the exact core innovation in AURA Sentinel?"
> **Answer:** *"Sir, our core innovation is the continuous translation of technical security telemetry (listening sockets, process states, and compute saturation) into an actuarial monetary cyber risk estimate (Expected Annual Loss in ₹ INR), paired with a budget-constrained Knapsack optimizer that calculates Return on Security Investment (ROSI) under hard institutional budget limits."*

### Q2: "How is this different from a traditional SIEM like Wazuh or Splunk?"
> **Answer:** *"A SIEM aggregates and searches log events, alerting that 'Event ID 4625 occurred'. It does not quantify how many rupees that event puts at risk, nor does it tell an executive how to allocate a ₹25 Lakh budget across competing security controls. AURA Sentinel acts as an actuarial and decision-support layer above raw telemetry."*

### Q3: "How exactly do you calculate financial cyber risk in your code?"
> **Answer:** *"In our prototype `Ai_Engine/Risk_engine/financial_engine.py`, we take a calibrated baseline hourly operational loss rate (₹15,000/hr) multiplied by a risk factor derived from listening sockets and CPU/RAM saturation. This hourly rate is multiplied by projected recovery downtime hours (1, 4, or 8 hours depending on severity) plus recovery overhead (35%) to estimate direct incident liability."*

### Q4: "Where does the financial data come from?"
> **Answer:** *"Currently, the financial asset value and institutional budget are inputted by the administrator based on organizational asset criticality. The operational downtime rate is calibrated against standard enterprise outage averages. In future enterprise deployments, this will integrate directly with organizational enterprise resource planning (ERP) and asset databases."*

### Q5: "Is your Expected Annual Loss value real or simulated?"
> **Answer:** *"In our current MVP, it is an illustrative prototype calculation. It grounds the mathematics on real live host signals—such as actual open sockets and CPU stress—combined with user-defined asset values, rather than producing purely fictional figures."*

### Q6: "How does your investment optimizer work?"
> **Answer:** *"It implements a budget-constrained Knapsack optimization algorithm. Given an explicit monthly budget constraint (e.g. ₹1,00,000), it filters out unaffordable packages, computes projected risk reduction savings, subtracts defense cost to determine net financial benefit, and ranks options using a composite score of affordability, net benefit, and ROSI ROI %."*

### Q7: "Why do you need blockchain? Why not just use a traditional relational database?"
> **Answer:** *"Traditional relational databases (like MySQL or PostgreSQL) rely on system administrator permissions. If an insider administrator's credentials are compromised via spear-phishing or bribery, they can execute `UPDATE` or `DELETE` SQL queries to alter audit logs and cover up a breach. A blockchain enforces cryptographic immutability: altering past records invalidates the Merkle root and previous-hash references."*

### Q8: "What happens if someone modifies an old blockchain record on disk?"
> **Answer:** *"Our `verify_integrity()` function recomputes the SHA-256 Merkle root of each block's transaction dictionary and verifies that the block header hash matches. Modifying even one character in Block #1 changes its hash, breaking the `previous_hash` link of Block #2. The audit immediately fails and flags the exact corrupted block index."*

### Q9: "Is this platform actually deployed in production anywhere today?"
> **Answer:** *"No, sir. We are completely transparent: AURA Sentinel is currently a fully functional standalone MVP prototype. It is tested on commodity campus hardware and submitted for SIH26105. It is designed for pilot deployment in academic or enterprise environments."*

### Q10: "Are the AICTE, IIT Delhi, and NIT Surathkal nodes real?"
> **Answer:** *"No, sir. Slide 12 clearly designates this as a 'Proposed Future Multi-Institution Architecture'. It represents our conceptual design for how a consortium blockchain could be structured across higher education institutions in the future, not an active partnership."*

### Q11: "How accurate is your AI model?"
> **Answer:** *"Our risk scoring engine currently relies on deterministic mathematical weighting and heuristic categorization rather than opaque black-box neural networks. For operator presence detection, we utilize Ultralytics YOLOv8-nano, which achieves reliable person detection on standard webcams under normal ambient room lighting."*

### Q12: "What datasets were used to train your models?"
> **Answer:** *"The YOLOv8-nano model comes pre-trained on the COCO dataset (Common Objects in Context), specifically optimized for low-latency person detection. The MediaPipe Hand Landmarker was trained on thousands of annotated 3D hand coordinates. Our risk scoring and Knapsack optimizer use algorithmic formulations derived from the Open FAIR standard."*

### Q13: "What is actually working in your prototype today?"
> **Answer:** *"Live host telemetry ingestion (sockets, CPU, RAM, disk), port threat classification, prototype financial exposure calculation, What-If hypothetical tuning and wargame simulation, Knapsack investment optimization, SHA-256 Merkle blockchain ledger with Proof-of-Work and live tamper detection, YOLOv8 presence auto-lock, MediaPipe gesture controls, and executive PDF audit report generation."*

### Q14: "What features are strictly future scope?"
> **Answer:** *"Future scope includes: native enterprise log forwarders for Wazuh, Splunk, and AWS/Azure CSPM; probabilistic Monte Carlo Value-at-Risk (VaR) distributions; automated RFP pricing ingestion; and deploying multi-node peer-to-peer consensus across multiple distinct physical servers."*

### Q15: "How would an enterprise connect their existing SIEM/EDR/IAM/CSPM data?"
> **Answer:** *"In our production roadmap, AURA Sentinel will expose standard Syslog, Webhook, and REST API ingest collectors. Log forwarders (such as Fluentbit or Logstash) will push normalized JSON security events into AURA's ingestion pipeline, which normalizes telemetry into our risk scoring engine."*

### Q16: "How does the system scale across multiple servers?"
> **Answer:** *"Currently, AURA Sentinel operates local-first on a single host. In enterprise deployment, lightweight agent collectors will forward host telemetry via gRPC/mTLS to a central clustered FastAPI ingestion service backed by distributed Redis queues and a consortium blockchain network."*

### Q17: "What happens if your risk model gives an inaccurate financial estimate?"
> **Answer:** *"AURA Sentinel is designed strictly as a decision-support platform, not an autonomous financial controller. All formulas, baseline rates, and weights are completely transparent and configurable by the organization's CISO and risk governance committee to fit their specific risk tolerance."*

### Q18: "Why should an executive leadership team trust your financial estimate?"
> **Answer:** *"Because our formulation is grounded in the international Open FAIR standard (Factor Analysis of Information Risk - ANSI/FAIR). Rather than generating random severity scores, we make every variable transparent: hourly disruption rate, expected downtime duration, and recovery overhead."*

### Q19: "Can you demonstrate the entire workflow live right now?"
> **Answer:** *"Yes, absolutely, sir! We have structured our 5-minute live demonstration strictly around fully functional, runnable components in our local MVP build, from host telemetry to blockchain tamper detection."*

### Q20: "Where is Proof-of-Work implemented in your blockchain code?"
> **Answer:** *"In `Backend/blockchain_ledger.py`, lines 226 through 234. In the `mine_block()` method, a `while True` loop increments a `nonce` value and rehashes the candidate block header until the resulting SHA-256 hash satisfies our difficulty prefix (`hash.startswith('0')`), ensuring verifiable proof of computational work before appending."*

---

## 8. FINAL SIH SUBMISSION CHECKLIST

- [x] **PPT Deck Synchronized:** All 14 slides reflect exact codebase capabilities, evaluator-safe terminology, and official team metadata (`ByteForce_1`, `180219`, `SIH26105`).
- [x] **Unsupported Claims Removed:** No exaggerated institutional claims, unverified millisecond latencies, or absolute security statements.
- [x] **PowerPoint File Ready:** `.pptx` presentation compiled and saved at `C:\Users\aryan\OneDrive\Desktop\AURA_SENTINEL_SIH26105.pptx` and in `Docs/`.
- [x] **Backend & Frontend Verified:** All 11 operational modules verified runnable via `run_aura_mvp.bat`.
- [x] **Tamper Detection Demo Verified:** Live tamper attack and consensus restore verified via `/api/blockchain/tamper-demo` and `/api/blockchain/restore-consensus`.
- [x] **Git Repository Synchronized:** Clean git working tree pushed to `https://github.com/aryanbaghel756-spec/AURA-SENTINEL.git`.
